const User = require("../Model/UserModel");

// Get all users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();

        // Check if any users were found
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" });
        }

        // Send response with users
        return res.status(200).json({ users });
    } catch (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Add a new user
const addUsers = async (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ message: "Request body is missing" });
    }

    const { CID, package , discount, extra, type, date , gmail } = req.body;

    // Validate required fields
    if (!CID || !package || !discount || !extra || !type || !date || !gmail) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const user = new User({ CID, package, discount, extra, type, date , gmail });
        await user.save();
        return res.status(201).json({ user });
    } catch (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//get by id

const getById= async(req, res,next)=>{

    const id=req.params.id;

    let user;
    try{
        user=await User.findById(id);
    }catch (err){
        console.log(err)
    }
    //not a user
    if(!user){
        return res.status(404).json({message:"unable to find"})
    }
    return res.status(200).json({user});
};

//update user details
const updateUser= async (req,res,next)=>{

    const id= req.params.id;
    const { CID, package , discount, extra, type, date , gmail } = req.body;

    let users;

    try{
        users=await User.findByIdAndUpdate(id,
            {CID:CID, package:package , discount:discount, extra:extra, type:type , date:date , gmail:gmail});
            users = await users.save();
        
    }catch(err){
        console.log(err);
    }
    //not a updated
    if(!users){
        return res.status(404).json({message:"unable to update"})
    }
    return res.status(200).json({users});

};

//delete user
const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;

    try{
        user=await User.findByIdAndDelete(id)
    }catch (err){
        console.log(err);
    }
    //not a updated
    if(!user){
        return res.status(404).json({message:"unable to delete"})
    }
    return res.status(200).json({user});
};



exports.getById=getById;
exports.addUsers = addUsers;
exports.getAllUsers = getAllUsers;
exports.updateUser=updateUser;
exports.deleteUser=deleteUser;