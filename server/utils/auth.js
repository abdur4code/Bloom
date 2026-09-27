import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateTokens = (userId) => {
   const accessToken = jwt.sign({ id: userId }, config.ACCESS_SECRET_KEY, { expiresIn: "15m" });
   const refreshToken = jwt.sign({ id: userId }, config.REFRESH_SECRET_KEY, { expiresIn: "7d" });

   return { accessToken, refreshToken };
}

export const verifyAccessToken = (token) => {
   try {
      const decoded = jwt.verify(token, config.ACCESS_SECRET_KEY);
      return decoded;
   } catch (error) {
      console.error("Error verifying access token:", error);
      return null;
   }
}

export const verifyRefreshToken = (token) => {
   try {
      const decoded = jwt.verify(token, config.REFRESH_SECRET_KEY);
      return decoded;
   } catch (error) {
      console.error("Error verifying refresh token:", error);
      return null;
   }
}