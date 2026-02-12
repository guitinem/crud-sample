const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // Extrai o token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ 
        error: "Token de autenticação não fornecido" 
      });
    }

    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ 
        error: "Formato de token inválido" 
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ 
        error: "Token mal formatado" 
      });
    }

    // Verifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adiciona o ID do usuário ao request
    req.userId = decoded.id;

    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Token inválido" 
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Token expirado" 
      });
    }

    return res.status(500).json({ 
      error: "Erro na validação do token" 
    });
  }
};

module.exports = authMiddleware;
