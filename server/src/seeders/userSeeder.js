require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    console.log("Seeder process started...")
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminExists = await User.findOne({ 
      email: "admin@spsgroup.com.br" 
    });

    if (adminExists) {
      console.log("User already exists.");
      await mongoose.connection.close();
      return;
    }

    const adminUser = await User.create({
      name: "admin",
      email: "admin@spsgroup.com.br",
      type: "admin",
      password: "1234",
    });


    await mongoose.connection.close();
    console.log("Seeder process finished!");
  } catch (error) {
    console.error("Error running seeder:", error.message);
    process.exit(1);
  }
};

seedUsers();
