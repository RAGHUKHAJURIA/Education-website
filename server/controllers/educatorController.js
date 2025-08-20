import { clerkClient } from "@clerk/express"


// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth();

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized: No valid userId." });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: { role: "educator" }
        });

        res.json({ success: true, message: "User role updated to educator." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
