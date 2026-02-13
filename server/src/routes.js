const { Router } = require("express");
const UserController = require("./controllers/UserController");
const AuthController = require("./controllers/AuthController");
const authMiddleware = require("./middlewares/auth");

const routes = Router();

routes.get("/", (req, res) => {
  res.json({ message: "Crud Sample - User Management" });
});

routes.post("/auth/login", AuthController.login);

// Rotas protegidas por autenticação
routes.get("/me", authMiddleware, AuthController.me);
routes.post("/users", authMiddleware, UserController.store);
routes.get("/users", authMiddleware, UserController.index);
routes.get("/users/:id", authMiddleware, UserController.show);
routes.put("/users/:id", authMiddleware, UserController.update);
routes.delete("/users/:id", authMiddleware, UserController.destroy);

module.exports = routes;
