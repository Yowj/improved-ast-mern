import User from "../models/user.model.js";

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "No userId given" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error deleting template:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
