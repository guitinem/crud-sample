require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Conectado ao MongoDB");

    const adminExists = await User.findOne({ 
      email: "admin@spsgroup.com.br" 
    });

    if (adminExists) {
      console.log("Usuário admin já existe!");
      await mongoose.connection.close();
      return;
    }

    const adminUser = await User.create({
      name: "admin",
      email: "admin@spsgroup.com.br",
      type: "admin",
      password: "1234",
    });

    console.log("Usuário admin criado com sucesso!");
    console.log({
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      type: adminUser.type,
    });

    await mongoose.connection.close();
    console.log("Seeder finalizado!");
  } catch (error) {
    console.error("Erro ao executar seeder:", error.message);
    process.exit(1);
  }
};

seedUsers();
