const User = require("../models/User");

class UserController {
  // Lista todos os usuários
  async index(req, res) {
    try {
      const users = await User.find().select();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ 
        error: "Erro ao buscar usuários",
        message: error.message 
      });
    }
  }

  // Busca um usuário específico
  async show(req, res) {
    try {
      const user = await User.findById(req.params.id).select();

      if (!user) {
        return res.status(404).json({ 
          error: "User not found" 
        });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ 
        error: "Error fetching user data",
        message: error.message 
      });
    }
  }

  // Cria um novo usuário
  async store(req, res) {
    try {
      const { name, email, type, password } = req.body;

      // Valida campos obrigatórios
      if (!name || !email || !password) {
        return res.status(400).json({ 
          error: "Nome, email e senha são obrigatórios" 
        });
      }

      // Verifica se o email já existe
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(409).json({ 
          error: "Email já cadastrado" 
        });
      }

      // Cria o usuário
      const user = await User.create({
        name,
        email,
        type: type || "user",
        password,
      });

      return res.status(201).json(user);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ 
          error: "Erro de validação",
          message: error.message 
        });
      }

      return res.status(500).json({ 
        error: "Erro ao criar usuário",
        message: error.message 
      });
    }
  }

  // Atualiza um usuário
  async update(req, res) {
    try {
      const { name, email, type, password } = req.body;

      // Verifica se o usuário existe
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ 
          error: "Usuário não encontrado" 
        });
      }

      // Verifica se o email já está em uso por outro usuário
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        
        if (emailExists) {
          return res.status(409).json({ 
            error: "Email já cadastrado" 
          });
        }
      }

      // Atualiza os campos
      if (name) user.name = name;
      if (email) user.email = email;
      if (type) user.type = type;
      if (password) user.password = password;

      await user.save();

      return res.status(200).json(user);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({ 
          error: "Erro de validação",
          message: error.message 
        });
      }

      return res.status(500).json({ 
        error: "Erro ao atualizar usuário",
        message: error.message 
      });
    }
  }

  // Remove um usuário
  async destroy(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ 
          error: "Usuário não encontrado" 
        });
      }

      await user.deleteOne();

      return res.status(200).json({ 
        message: "Usuário removido com sucesso" 
      });
    } catch (error) {
      return res.status(500).json({ 
        error: "Erro ao remover usuário",
        message: error.message 
      });
    }
  }
}

module.exports = new UserController();
