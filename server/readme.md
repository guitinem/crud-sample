----------------------------------
ESPANHOL
----------------------------------

## Prueba NODE

- Crear un CRUD (API REST) en Node para el registro de usuarios.
- Para la creación de la prueba, utilizar un repositorio falso de usuarios (puede ser en memoria).

## Reglas

- Debe existir un usuario administrador previamente registrado para utilizar la autenticación (no es necesario cifrar la contraseña):
{
  "name": "admin",
  "email": "admin@spsgroup.com.br",
  "type": "admin",
  "password": "1234"
}

- Crear una ruta de autenticación (token Jwt).
- Las rutas de la API solo pueden ser ejecutadas si el usuario está autenticado.
- Debe ser posible añadir usuarios con los campos: email, nombre, type, password.
- No debe ser posible registrar un correo electrónico ya existente.
- Debe ser posible eliminar usuarios.
- Debe ser posible modificar los datos de un usuario.


----------------------------------
PORTUGUÊS
----------------------------------

# Teste NODE

- Criar um CRUD (API REST) em node para cadastro de usuários
- Para a criação do teste utilizar um repositório fake dos usuários. (Pode ser em memória)

## Regras

- Deve existir um usuário admin previamente cadastrado para utilizar autenticação (não precisa criptografar a senha);
  {
    name: "admin",
    email: "admin@spsgroup.com.br",
    type: "admin"
    password: "1234"
  }

- Criar rota de autenticação (Jwt token)
- As rotas da API só podem ser executadas se estiver autenticada
- Deve ser possível adicionar usuários. Campos: email, nome, type, password
- Não deve ser possível cadastrar o e-mail já cadastrado
- Deve ser possível remover usuário
- Deve ser possível alterar os dados do usuário

---

# 🚀 Implementação Completa com MongoDB

## 📋 Tecnologias

- **Node.js** com Express
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **bcryptjs** para hash de senhas

## 🗄️ Instalação e Configuração

```bash
# 1. Instalar dependências
npm install

# 2. Copiar arquivo de configuração
cp .env.example .env

# 3. Editar .env com suas configurações:
#    - MONGODB_URI (MongoDB local ou Atlas)
#    - JWT_SECRET (chave secreta forte)
#    - PORT (padrão: 3000)

# 4. Garantir que MongoDB está rodando
mongod  # (se local)

# 5. Executar seeder para criar usuário admin
npm run seed
```

## 🏃 Executar Aplicação

```bash
npm run dev  # Inicia com nodemon e debugger na porta 7000
```

Servidor disponível em: `http://localhost:3000`

## 📚 Endpoints da API

### Autenticação

**POST /auth** - Login
```json
{
  "email": "admin@spsgroup.com.br",
  "password": "1234"
}
```

**GET /me** - Dados do usuário autenticado (requer token)

### Usuários

**POST /users** - Criar usuário (público)
```json
{
  "name": "Nome",
  "email": "email@exemplo.com",
  "type": "user",
  "password": "senha"
}
```

**GET /users** - Listar usuários (requer autenticação)

**GET /users/:id** - Buscar usuário (requer autenticação)

**PUT /users/:id** - Atualizar usuário (requer autenticação)

**DELETE /users/:id** - Deletar usuário (requer autenticação)

## 🏗️ Estrutura

```
server/src/
├── config/database.js          # Conexão MongoDB
├── models/User.js              # Schema Mongoose com hash de senha
├── controllers/
│   ├── AuthController.js       # Login e validação
│   └── UserController.js       # CRUD completo
├── middlewares/auth.js         # Validação JWT
├── seeders/userSeeder.js       # Cria admin inicial
├── routes.js                   # Rotas com guards
└── index.js                    # Entrada da app
```

## ✅ Regras Implementadas

- ✅ Email único (erro 409 se duplicado)
- ✅ Senhas hasheadas automaticamente
- ✅ Autenticação JWT obrigatória (exceto POST /users)
- ✅ Usuário admin pré-cadastrado via seeder
- ✅ CRUD completo de usuários
- ✅ Validações de campos obrigatórios

