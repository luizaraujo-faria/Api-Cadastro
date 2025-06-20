# API-Cadastro

API RESTFull para cadastro e gestão de usuários, autenticação e controle de usuário por papel('Cliente' | 'Admin').

# Tecnologias utilizadas

- Node.js (JavaScript);
- Express.js
- SGBDR (MySQL);
- ORM (Prisma);
- Autenticação (JWT);
- Criptografia (Bcrypt);
- Dotenv.

# Pastas / Arquivos

- src/
    ├── Controllers/
        ├── indexController.js (Arquivo principal para importação e exportação de controladores).
        ├── userController.js (Controlador da classe e metodos do usuário).

    ├── Middlewares/
        ├── authmiddleware.js (Middleware de autenticação de usuário).

    ├── Routes/
        ├── index.routes.js (Arquivo principal para importação e exportação de rotas).
        ├── user.routes.js (Rotas de usuário).
    
    ├── server.js (Arquivo principal onde está rodando o servidor).

- prisma/
    ├── schema.prisma

# ©2025 - Todos Os Direitos Reservados.