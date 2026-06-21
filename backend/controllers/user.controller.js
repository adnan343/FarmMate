import bcrypt from "bcrypt"; // Import bcrypt for password hashing and verification
import jwt from "jsonwebtoken"; // Import jwt for cryptographic session tokens
import mongoose from 'mongoose';
import User from "../models/user.model.js"; // User model
import Product from "../models/product.model.js";
import { getJwtSecret } from '../config/jwt.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ['farmer', 'buyer'];

// ... other imports and functions

export const getMyProfile = async (req, res) => {
    const userId = req.user?._id?.toString();

    if (!userId) {
        return res.status(401).json({ success: false, msg: 'Not authenticated.' });
    }

    try {
        const user = await User.findById(userId).select(
            'email name role phone location bio farms createdAt updatedAt'
        );

        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        return res.status(200).json({
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
            },
        });
    } catch (error) {
        console.error('Error fetching my profile:', error);
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
};

export const updateMyProfile = async (req, res) => {
    const userId = req.user?._id?.toString();
    const updates = req.body;

    if (!userId) {
        return res.status(401).json({ success: false, msg: 'Not authenticated.' });
    }

    // Validate payload - only allow profile fields
    const allowedFields = ['name', 'email', 'phone', 'location', 'bio'];
    const sanitized = {};

    for (const key of allowedFields) {
        if (!Object.prototype.hasOwnProperty.call(updates || {}, key)) continue;

        const val = updates[key];

        // Avoid sending empty strings that can trigger validation errors.
        // Treat empty string as "not updating this field".
        if (typeof val === 'string') {
            const trimmed = val.trim();
            if (trimmed.length === 0) continue;
            sanitized[key] = trimmed;
        } else if (val !== undefined && val !== null) {
            sanitized[key] = val;
        }
    }

    // Validate email format if provided
    if (sanitized.email !== undefined) {
        const email = String(sanitized.email || '').trim().toLowerCase();
        if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
            return res.status(400).json({ success: false, msg: 'Please provide a valid email address.' });
        }
        sanitized.email = email;
    }

    // Validate name length if provided
    if (sanitized.name !== undefined) {
        const name = String(sanitized.name || '').trim();
        if (!name) return res.status(400).json({ success: false, msg: 'Name is required.' });
        if (name.length > 100) return res.status(400).json({ success: false, msg: 'Name must be 100 characters or less.' });
        sanitized.name = name;
    }


    // Never allow client to change password here (use /change-password)
    // (Also we never allow role changes in sanitized updates anyway)


    try {
        const updatedUser = await User.findByIdAndUpdate(userId, sanitized, {
            new: true,
            runValidators: true,
        });


        if (!updatedUser) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        return res.status(200).json({
            success: true,
            msg: 'User updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Error updating my profile:', error);

        // Handle common Mongoose/Mongo errors gracefully (so UI doesn't show generic 500)
        if (error?.code === 11000) {
            return res.status(409).json({ success: false, msg: 'Email already exists.' });
        }

        if (error?.name === 'ValidationError') {
            return res.status(400).json({ success: false, msg: error.message || 'Invalid profile data.' });
        }

        // If provided email triggers unique/other constraint errors, respond as a bad request instead of 500
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
};

export const changeMyPassword = async (req, res) => {
    const userId = req.user?._id?.toString();
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, msg: 'Please provide both current and new passwords.' });
    }

    if (!userId) {
        return res.status(401).json({ success: false, msg: 'Not authenticated.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: 'Invalid current password.' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ success: true, msg: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error changing my password:', error);
        return res.status(500).json({ success: false, msg: 'Internal Server Error.' });
    }
};

export const changePassword = async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;




    if (!currentPassword || !newPassword) {
        return res.status(400).json({ success: false, msg: "Please provide both current and new passwords." });
    }

    // C8: Only the account owner can change their own password
    if (req.user._id.toString() !== id) {
        return res.status(403).json({ success: false, msg: "Not authorized to change this user's password." });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }

        // Check if the current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid current password." });
        }

        // Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, msg: "Password updated successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error." });
    }
};

export const createUser = async (req, res) => {
    const user = req.body;

    if (!user || typeof user !== 'object') {
        return res.status(400).json({ success: false, msg: 'Invalid request payload' });
    }

    // Ensure all required fields exist
    const email = String(user.email || '').trim().toLowerCase();
    const name = String(user.name || '').trim();
    const password = String(user.password || '');
    const userType = String(user.userType || '').trim();

    if (!email || !password || !name || !userType) {
        return res.status(400).json({ success: false, msg: 'Please provide all required fields.' });
    }

    if (!EMAIL_REGEX.test(email) || email.length > 254) {
        return res.status(400).json({ success: false, msg: 'Please provide a valid email address.' });
    }

    if (name.length > 100) {
        return res.status(400).json({ success: false, msg: 'Name must be 100 characters or less.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ success: false, msg: 'Password must be at least 8 characters long.' });
    }

    const role = ALLOWED_ROLES.includes(userType.toLowerCase()) ? userType.toLowerCase() : null;
    if (!role) {
        return res.status(400).json({ success: false, msg: 'Invalid user type. Must be farmer or buyer.' });
    }

    try {
        const emailExists = await checkUsernameExists(email);
        if (emailExists) {
            return res.status(400).json({ success: false, msg: 'Email already exists.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            email,
            password: hashedPassword,
            name,
            role
        };

        const newUser = new User(userData);
        await newUser.save();
        res.status(201).json({ success: true, msg: 'User created successfully' });
    } catch (err) {
        console.error('Error in creating user:', err);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    // C6: Only the account owner or an admin can update a user
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: "Not authorized to update this user." });
    }

    // Prevent non-admins from escalating their own role
    if (updates.role && req.user.role !== 'admin') {
        delete updates.role;
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

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    // C7: Only the account owner or an admin can delete a user
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: "Not authorized to delete this user." });
    }

    try {
        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ success: false, msg: "User not found." });
        }

        const isProduction = process.env.NODE_ENV === 'production';
        const clearOptions = {
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        };

        res.clearCookie('token', clearOptions);
        res.clearCookie('userId', clearOptions);

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

// In user.controller.js

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const normalizedEmail = String(email || '').trim().toLowerCase();
    const inputPassword = String(password || '');

    if (!normalizedEmail || !inputPassword) {
        return res.status(400).json({ success: false, msg: 'Please provide both email and password' });
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
        return res.status(400).json({ success: false, msg: 'Please provide a valid email address' });
    }

    try {
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }

        // Compare input password with hashed password in the database
        const isMatch = await bcrypt.compare(inputPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid password" });
        }

        // Create JWT token containing userId and role
        let jwtSecret;
        try {
            jwtSecret = getJwtSecret();
        } catch (jwtError) {
            console.error('JWT configuration error:', jwtError.message);
            return res.status(500).json({ success: false, msg: 'Server configuration error' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Cookie options: use SameSite=None so cookies are sent on cross-site fetch requests from the frontend.
        // Use secure cookies only in production. Local dev remains http and uses secure=false.
        // Note: SameSite=None requires Secure=true in modern browsers, so use 'lax' for local dev
        const isProduction = process.env.NODE_ENV === 'production';
        const cookieOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 3600000,
            path: '/'
        };

        // Set the JWT token in an httpOnly cookie
        res.cookie('token', token, cookieOptions);

        // Expose a non-httpOnly userId cookie so client code can read the current user ID
        const userIdCookieOptions = { ...cookieOptions, httpOnly: false };
        res.cookie('userId', user._id, userIdCookieOptions);

        // If login is successful, respond back with user data
        res.status(200).json({
            success: true,
            msg: "User logged in successfully",
            data: {
                userId: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === 'production';
        const clearOptions = {
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            path: '/'
        };

        res.clearCookie('token', clearOptions);
        res.clearCookie('userId', clearOptions);
        res.status(200).json({ success: true, msg: "Logged out successfully" });
    } catch (error) {
        console.error("Error during logout:", error.message);
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
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Not authorized to view this user.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

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
            },
        });
    } catch (error) {
        console.error('Error fetching user by ID:', error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

export const getUsers = async (req, res) => {
    // C3 + C2: Admin-only; strip passwords
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Admin access required.' });
    }
    try {
        const users = await User.find({}).select('-password');
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

// Public farmer profile - any authenticated user can view basic farmer info
export const getFarmerPublicProfile = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    try {
        const user = await User.findById(id).select('name email phone location bio farms role');
        if (!user) {
            return res.status(404).json({ success: false, msg: 'Farmer not found.' });
        }

        // Only expose farmers
        if (user.role !== 'farmer') {
            return res.status(404).json({ success: false, msg: 'Farmer not found.' });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location,
                bio: user.bio,
                farms: user.farms,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Error fetching farmer profile:', error.message);
        res.status(500).json({ success: false, msg: 'Internal Server Error' });
    }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, msg: "Valid product ID is required" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    if (!userId || !mongoose.Types.ObjectId.isValid(userId) || !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, msg: "Invalid user or product ID" });
    }

    // Ensure user can only manage their own favorites
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ success: false, msg: "Not authorized to manage this user's favorites" });
    }

    try {
        const [user, product] = await Promise.all([
            User.findById(userId),
            Product.findById(productId).select('_id')
        ]);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }
        if (!product) {
            return res.status(404).json({ success: false, msg: "Product not found" });
        }

        // Check if product is already in favorites
        if (user.favorites.some(id => id.toString() === productId)) {
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

    // Ensure user can only manage their own favorites
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ success: false, msg: "Not authorized to manage this user's favorites" });
    }

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
// Admin: suspend a user
export const suspendUser = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Admin access required.' });
    }

    if (req.user._id.toString() === id) {
        return res.status(400).json({ success: false, msg: 'Cannot suspend your own account.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, msg: 'Cannot suspend an admin account.' });
        }

        user.isSuspended = true;
        await user.save();

        res.status(200).json({
            success: true,
            msg: `User ${user.name} has been suspended.`,
            data: { id: user._id, name: user.name, email: user.email, role: user.role, isSuspended: user.isSuspended }
        });
    } catch (error) {
        console.error("Error suspending user:", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error." });
    }
};

// Admin: activate a user
export const activateUser = async (req, res) => {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, msg: 'Invalid user ID.' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, msg: 'Admin access required.' });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, msg: 'User not found.' });
        }

        user.isSuspended = false;
        await user.save();

        res.status(200).json({
            success: true,
            msg: `User ${user.name} has been activated.`,
            data: { id: user._id, name: user.name, email: user.email, role: user.role, isSuspended: user.isSuspended }
        });
    } catch (error) {
        console.error("Error activating user:", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error." });
    }
};

export const getUserFavorites = async (req, res) => {
    const { userId } = req.params;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, msg: "Invalid user ID" });
    }

    // Ensure user can only view their own favorites
    if (req.user._id.toString() !== userId) {
        return res.status(403).json({ success: false, msg: "Not authorized to view this user's favorites" });
    }

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
