import UserModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/auth.js";


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
                user:{
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
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordMatched){
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const {accessToken, refreshToken} = generateTokens(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        
    } catch (error) {
        console.log("Error in login controller:", error);
        return res.status(500).json({
            error:"Internal server error"
        })
    }
}