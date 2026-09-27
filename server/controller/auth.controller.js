import UserModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { generateTokens, verifyAccessToken, verifyRefreshToken } from "../utils/auth.js";


/**
 * @POST /api/auth/register
 */
export const authRegisterController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            console.log("Email already registered")
            return res.status(409).json({
                error: "Email already registered"
            })
        }

        const user = await UserModel.create({
            name,
            email,
            passwordHash: await bcrypt.hash(password, 12),
        })

        res.status(201).json({
            message: "User registered successfully",
            data: {
                user: {
                    name: user.name,
                    email: user.email
                }
            }
        })
    } catch (error) {
        console.log("auth register controller error:", error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

/**
 * @POST /api/auth/login
 */
export const authLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            console.log("Invalid email or password")
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            console.log("Invalid email or password")
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const { accessToken, refreshToken } = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(200).json({
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    name: user.name,
                    email: user.email
                }
            }
        })

    } catch (error) {
        console.log("Error in login controller:", error);
        return res.status(500).json({
            error: "Internal server error"
        })
    }
}

/**
 * @GET /api/auth/me
 */
export const authMeController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "User not authenticated",
            });
        }

        const user = req.user;

        res.status(200).json({
            message: "User fetched successfully",
            data: {
                user: {
                    name: user.name,
                    email: user.email,
                },
            },
        });
    } catch (error) {
        console.log('Invalid or expired Access Token:', error);
        return res.status(401).json({
            message: "Invalid or expired Access Token"
        })
    }
}


/**
 * @GET /api/auth/refresh-token
 */
export const authRefreshController = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token is missing",
            });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const user = await UserModel.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token",
            });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, { httpOnly: true });

        res.status(200).json({
            message: "Tokens refreshed successfully",
            data: {
                accessToken,
            },
        });
    } catch (error) {
        console.log("Error in auth/refresh controller:", error);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}

/**
 * @POST /api/auth/logout
 */
export const authLogoutController = async (req, res) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({
                message: "Access token is missing",
            });
        }

        const decoded = verifyAccessToken(accessToken);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Invalid access token",
            });
        }

        user.refreshToken = null;
        await user.save();

        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log("Error in auth/logout controller:", error);
        res.status(500).json({
            message: "Internal server error",
        })
    }
}