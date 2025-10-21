import usermodel from '../models/user.model.js';
import notificationmodel from '../models/notification.model.js';
import { clerkClient, getAuth } from "@clerk/express";

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await usermodel.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const user = usermodel.findOneAndUpdate({ clerkId: userId }, req.body, { new: true })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Update Profile Error", error: error.message });
    }
}

export const syncUser = async (req, res) => {
    try {
        const { userId } = getAuth(req);

        const existuser = await usermodel.findOne({ clerkId: userId });
        if (existuser) {
            return res.status(200).json({ user: existuser, message: "User already exists" });
        }

        const clerkUser = await clerkClient.users.getUser(userId);

        const UserData = {
            clerkId: userId,
            email: clerkUser.emailAddresses[0].emailAddress,
            firstName: clerkUser.firstName || "",
            lastName: clerkUser.lastName || "",
            username: clerkUser.emailAddresses[0].emailAddress.split("@")[0], //if john@gamil.com so john will be the username
            profilePicture: clerkUser.imageUrl || "",
        }

        const newUser = await usermodel.create(UserData);
        res.status(201).json({ user: newUser, message: "User synced successfully" });
    } catch (error) {
        res.status(500).json({ message: "signup User Error", error: error.message });
    }
}

export const getcurrentUser = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        const user = await usermodel.findOne({ clerkId: userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}


export const followuser = async (req, res) => {
    try {
        const { userid } = getAuth(req);
        const { targetuserId } = req.params;

        if (userid === targetuserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currUser = await usermodel.findOne({ clerkId: userid });
        const targetuser = await usermodel.findById(targetuserId);

        if (!currUser || !targetuser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isfollowing = currUser.following.includes(targetuser._id);
        //  .includes() is a JavaScript array method that checks whether a specific value exists inside an array.

        // It returns a boolean:
        // 	•	true → if the value exists in the array
        // 	•	false → if it doesn’t


        if (isfollowing) {
            //if you already follow do unfollow
            await usermodel.findByIdAndUpdate(currUser._id, {
                $pull: { following: targetuser._id }
            });
            await usermodel.findByIdAndUpdate(targetuser._id, {
                $pull: { followers: currUser._id }
            });
        }
        else {
            //follow
            await usermodel.findByIdAndUpdate(currUser._id, {
                $push: { following: targetuser._id }
            });
            await usermodel.findByIdAndUpdate(targetuser._id, {
                $push: { followers: currUser._id }
            });

            //create notification
            await notificationmodel.create({
                from: currUser._id,
                to: targetuser._id,
                type: "follow"
            });
        }

        res.status(200).json({
            message: isfollowing ? "User unfollowed successfully" : "User followed successfully",
        })

    } catch (error) {
        res.status(500).json({ message: "Follow User Error", error: error.message });
    }
}