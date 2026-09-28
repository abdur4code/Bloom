import { verifyAccessToken} from "../utils/auth.js";
import UserModel from "../models/auth.model.js";

export const authenticate = async (req, res, next) => {
     try {
        const accessToken = req.headers.authorization?.split(" ")[1];
        if (!accessToken) {
            return res.status(401).json({
                message: "Access token is missing",
            });
        }

        const decoded = verifyAccessToken(accessToken);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid or expired Access Token"
            });
        }
        const user = await UserModel.findById(decoded.id);

        req.user = user;

        next();
    } catch (error) {
        console.log('Invalid or expired Access Token:', error);
        return res.status(401).json({
            message: "Invalid or expired Access Token"
        })
    }
}