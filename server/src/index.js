require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const connectDatabase = require("./config/database");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(routes);

// Conecta ao banco de dados e inicia o servidor
connectDatabase().then(() => {
  const PORT = process.env.PORT || 3000;
  
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
