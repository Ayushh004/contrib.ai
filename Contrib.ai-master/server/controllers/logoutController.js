import User from "../models/userModel.js";

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        
        // Clear cookies
        res.clearCookie('token', {
            path: '/'
        });
        res.clearCookie('refreshToken', {
            path: '/'
        });

        // Remove refresh token from user's refreshTokens array if it exists
        if (refreshToken) {
            await User.updateOne(
                { refreshTokens: refreshToken },
                { $pull: { refreshTokens: refreshToken } }
            );
        }
        
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};