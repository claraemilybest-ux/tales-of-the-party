import User from "../models/User.js";
import Message from "../models/Message.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { io, getReceiverSocketId } from "../lib/socket.js";


export async function getUsersForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-clerkId");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error fetching users for sidebar:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}

export async function getConversationsForSidebar(req, res) {
    try {
        const loggedInUserId = req.user._id;

        const conversations = await Message.aggregate([
            // keep messages user sends or receives
            { $match: { $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }] } },
            // collapse them into one row per chat friend, noting last time messaged
            { $group: { 
                _id: { $cond: [{ $eq: ["$senderId", loggedInUserId] }, "$receiverId", "$senderId"] }, 
                lastMessage: { $max: "$createdAt" },
                }, 
            },
            // most recent conversation at top
            { $sort: { lastMessage: -1 } },
            // get each friend's user profile (get an array back)
            { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
            // pull that profile out of array and make it the document
            { $replaceRoot: { newRoot: { $first: "$user"}}},
            // hide private clerkId from document
            { $project: { clerkId: 0 } },
        ]);

        res.status(200).json(conversations);

    } catch (error) {
        console.error("Error in getConversationsForSidebar:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export async function getMessages(req, res) {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessages:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function sendMessage(req, res) {
    try {
        const { text } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        let videoUrl;

        if (req.file){
            if(!hasImageKitConfig()) {
                return res.status(500).json({ error: "Media upload is not configured" });
            }

            const url = await uploadChatMedia(req.file);
            if (req.file.mimetype.startsWith("video/")) videoUrl = url;
            else imageUrl = url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
            video:videoUrl,
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        // only send message in real-time if user is online
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
    
}