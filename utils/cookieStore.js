import jwt from "jsonwebtoken";

export default function storeToCookie (dbUser, res) {
    const data = {
        userId: dbUser._id,
        username: dbUser.username,
        email: dbUser.email,
        phoneNumber: dbUser.phoneNumber,
        type: dbUser.type,
        location: dbUser.location
    };

    const farmer_token = jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("farmer_token", farmer_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "None",
    });

    return data;
}