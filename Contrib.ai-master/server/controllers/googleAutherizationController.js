import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const googleAuthorization =async (req, res) => {
    try {
        const { code } = req.body;
        console.log("google code is", code);
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is missing' });
        }
        const tokenUrl = 'https://oauth2.googleapis.com/token';
        const tokenValues = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/auth/google/callback', // Must match frontend
            grant_type: 'authorization_code',
        };
        const tokenResponse = await axios.post(tokenUrl, new URLSearchParams(tokenValues));
        const { access_token, id_token } = tokenResponse.data;
        const profileUrl = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
        const profileResponse = await axios.get(profileUrl, {
            headers: { Authorization: `Bearer ${id_token}` },
        });
        const googleUser = profileResponse.data;
        let user = await User.findOne({ email: googleUser.email });
        if (!user) {
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                authProvider: 'google', // Set kiya ki yeh Google account hai
                googleId: googleUser.id, // Google ki unique ID save ki
                avatar: googleUser.picture
            });
        }
        const myAppToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Generate Refresh Token
        const refreshToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "30d"
            }
        );

        // Store refresh token in user document
        if (!user.refreshTokens) {
            user.refreshTokens = [];
        }
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie('token', myAppToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        return res.status(200).json({ 
            success: true,
            message: 'Login successful', 
            user: { name: user.name, email: user.email, avatar: user.avatar } 
        });
        
    } catch (e) {
       console.error('Google Auth Error:', e);
       console.error('Error details:', e.message);
       console.error('Error stack:', e.stack);
        return res.status(500).json({ message: 'Authentication failed', error: e.message });
    }


}