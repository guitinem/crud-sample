# CRUD Sample - User Management System

Sistema completo de gerenciamento de usuários com React + Material-UI no frontend e Node.js + Express + MongoDB no backend.

Caso queira acessar online: https://crud-sample-plum.vercel.app/signin

---

## 📋 Requisitos

- **Node.js:** v20.16.0 ou superior
- **Docker:** Para rodar o MongoDB
- **Yarn:** Gerenciador de pacotes

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd crud-sample
```

### 2. Instale as dependências

**Backend:**
```bash
cd server
yarn install
```

**Frontend:**
```bash
cd client
yarn install
```

### 3. Configure as variáveis de ambiente

**Backend** (`server/.env`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sps-crud
JWT_SECRET=seu-secret-jwt-aqui
JWT_EXPIRES_IN=7d
```

**Frontend** (`client/.env`):
```env
PORT=3001
REACT_APP_API_URL=http://localhost:3000
```

### 4. Inicie o MongoDB com Docker
```bash
cd server
docker-compose up -d
```

### 5. Popule o banco de dados (primeira vez)
```bash
cd server
yarn seed
```

**Usuário padrão criado:**
- Email: `admin@spsgroup.com.br`
- Senha: `1234`

### 6. Rode o projeto (este comando roda o back e o front junto)
```bash
yarn dev
```

Frontend rodando em: `http://localhost:3001`
Backend rodando em: `http://localhost:3000`

---

## 🧪 Rodar Testes

**Backend:**
```bash
cd server
yarn test              # Executa todos os testes
yarn test:watch        # Modo watch
yarn test:coverage     # Com cobertura
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação com tokens
- **bcryptjs** - Hash de senhas
- **Docker** - Containerização do MongoDB

### Frontend
- **React** - Biblioteca para interfaces
- **Material-UI (MUI)** - Componentes de UI
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **js-cookie** - Gerenciamento de cookies

### Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de API (backend)

---

## 📝 Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD completo de usuários
- ✅ Proteção de rotas
- ✅ Validação de formulários
- ✅ Prevenção de emails duplicados
- ✅ Hash de senhas
- ✅ Interface responsiva com Material-UI
- ✅ Feedback visual (snackbars, loading states)
- ✅ Testes unitários e de integração

