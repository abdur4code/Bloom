import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required'],
    },
    refreshToken: {
        type: String
    }
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;