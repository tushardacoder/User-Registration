const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

app.use(express.json());

// MongoDB Atlas Connection
mongoose
  .connect("mongodb+srv://tusharbasak041_db_user:C3LdPUcl91YSYjci@cluster0.c6k7nst.mongodb.net/userdb?retryWrites=true&w=majority")
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
  });

// Schema
const userSchema = new mongoose.Schema({
 title: {
    type: String,
    required: true,
  },
  description: String,

  completed: {
    type: Boolean,
    default: false,
  },

  completedAt: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

// Create User
app.post("/createuser", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// read all user
// GET all users
app.get("/readallusers", async (req, res) => {
  try {
    const users = await User.find();   // get all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});
//find by id
// Get user by ID
app.get("/readuser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // get user by id

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Update user by ID
app.put("/updateuser/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(   // update user by id  
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

//delete
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id); // delete user by id

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});