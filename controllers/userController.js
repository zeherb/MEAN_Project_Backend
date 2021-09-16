const User = require('../models/userSchema');

// get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// get user by id
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update user
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// update user's avatar
exports.updateUsersAvatar = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { avatar: req.file.path }, { new: true });
        res.status(200).json({ message: "User's avatar updated successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// delete user
exports.deletUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect event manually
exports.affectEvent = async (req, res) => {
    try {
        const affectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $push: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event affected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect event
exports.desaffectEvent = async (req, res) => {
    try {
        const desaffectedEventToUser = await User.findByIdAndUpdate(req.params.idUser, { $pull: { events: req.params.idEvent } }, { new: true });
        res.status(200).json({ message: "Event desaffected successfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// affect admin role
exports.affectAdminRole = async (req, res) => {
    try {
        const affectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "admin" }, { new: true });
        res.json({ message: "Admin role affected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}

// desaffect admin role
exports.desaffectAdminRole = async (req, res) => {
    try {
        const desaffectedRole = await User.findByIdAndUpdate(req.params.idUser, { role: "user" }, { new: true });
        res.json({ message: "Admin role desaffected successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' })
    }
}