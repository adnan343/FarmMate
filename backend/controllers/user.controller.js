import bcrypt from "bcrypt"; // Import bcrypt for password hashing and verification
import User from "../models/user.model.js"; // User model

export const createUser = async (req, res) => {
    const user = req.body;

    // Ensure all required fields exist
    if (!user.email || !user.password || !user.name || !user.userType) {
        return res
            .status(400)
            .json({ success: false, msg: "Please provide all the required fields" });
    }

    try {
        // Check if email already exists
        const emailExists = await checkUsernameExists(user.email);
        if (emailExists) {
            return res
                .status(400)
                .json({ success: false, msg: "Username already exists" });
        }

        // Hash the password before saving the user
        const salt = await bcrypt.genSalt(10); // Generate salt
        const hashedPassword = await bcrypt.hash(user.password, salt); // Hash password
        
        // Create user object with proper field mapping
        const userData = {
            email: user.email,
            password: hashedPassword,
            name: user.name,
            role: user.userType // Map userType to role for the model
        };

        const newUser = new User(userData); // Create a new user with hashed password
        await newUser.save(); // Save the user to the database
        res.status(201).json({ success: true, msg: "User created successfully" });
    } catch (err) {
        console.error("Error in creating user:", err);
        res.status(500).json({ success: false, msg: "SERVER ERROR" });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters
    const updates = req.body; // Get update fields from request body

    if (!id) {
        return res
            .status(400)
            .json({ success: false, msg: "Please provide a user ID." });
    }

    try {
        // If a password update is included, hash it before saving
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Update the user by ID with the provided fields
        const updatedUser = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        // If user is not found, return error
        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }

        res.status(200).json({
            success: true,
            msg: "User updated successfully.",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error updating user: ", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error." });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res
            .status(400)
            .json({ success: false, msg: "Please provide a user ID." });
    }

    try {
        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }

        res.status(200).json({
            success: true,
            msg: "User deleted successfully.",
            data: { email: deletedUser.email, name: deletedUser.name },
        });
    } catch (error) {
        console.error("Error deleting user: ", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error." });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "Please provide both email and password",
        });
    }

    try {
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Compare input password with hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid password" });
        }

        // If login is successful, respond back with user data (you can also generate a token here)
        res.status(200).json({
            success: true,
            msg: "User logged in successfully",
            data: {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role, // Use role from model
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

const checkUsernameExists = async (email) => {
    try {
        // Use findOne to get a single document that matches the email
        const user = await User.findOne({ email: email });
        if (user) {
            console.log("Username already exists");
            return true; // Username exists
        }
        console.log("Username is available");
        return false; // Username does not exist
    } catch (err) {
        console.error("Error checking email:", err);
        throw err; // Propagate error
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params; // Get user ID from request parameters

    if (!id) {
        return res
            .status(400)
            .json({ success: false, msg: "Please provide a user ID." });
    }

    try {
        // Find the user by ID
        const user = await User.findById(id);

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }
        console.log("User found:", user.role);
        // Return the user details
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                farms: user.farms,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                // role: user.userType,
            },
        });
    } catch (error) {
        console.error("Error fetching user by ID: ", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in fetching users: ", error.message);
        res.status(500).json({ success: false, msg: "SERVER ERROR" });
    }
};

export const getUserIdByUsername = async (req, res) => {
    const { email } = req.params; // Get email from request parameters

    if (!email) {
        return res
            .status(400)
            .json({ success: false, msg: "Please provide a email." });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If user is not found, return an error
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }

        // Return the user ID
        res.status(200).json({
            success: true,
            data: {
                userId: user._id,
            },
        });
    } catch (error) {
        console.error("Error fetching user by email: ", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

// Get all farmers
export const getFarmers = async (req, res) => {
    try {
        const farmers = await User.find({ role: 'farmer' })
            .select('name email phone location bio farms')
            .populate('farms', 'name location');
        
        res.status(200).json({
            success: true,
            data: farmers
        });
    } catch (error) {
        console.error("Error fetching farmers:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!productId) {
        return res.status(400).json({ success: false, msg: "Product ID is required" });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Check if product is already in favorites
        if (user.favorites.includes(productId)) {
            return res.status(400).json({ success: false, msg: "Product already in favorites" });
        }

        user.favorites.push(productId);
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Product added to favorites",
            data: user.favorites
        });
    } catch (error) {
        console.error("Error adding to favorites:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

// Remove product from favorites
export const removeFromFavorites = async (req, res) => {
    const { userId, productId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        user.favorites = user.favorites.filter(id => id.toString() !== productId);
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Product removed from favorites",
            data: user.favorites
        });
    } catch (error) {
        console.error("Error removing from favorites:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

// Get user favorites
export const getUserFavorites = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId)
            .populate({
                path: 'favorites',
                populate: {
                    path: 'farmer',
                    select: 'name email phone'
                }
            });

        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user.favorites
        });
    } catch (error) {
        console.error("Error fetching user favorites:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};
