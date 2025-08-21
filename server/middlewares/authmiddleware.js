import { clerkClient } from "@clerk/express";

// MiddleWare (Protect Educator Route

export const protectEducatorRoute = async (req, res, next) => {
    try {
        const { userId } = req.auth;
        const response = await clerkClient.users.getUser(userId);

        if(response.publicMetadata.role !== "educator") {
            return res.json({
                success: false,
                message: "Forbidden: You do not have access to this resource."
            });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
