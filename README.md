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
        ├── adminController.js (Controlador da classe e metodos do administrador).

    ├── Middlewares/
  
        ├── authmiddleware.js (Middleware de autenticação de usuário).
        ├── checkUserStatus.js (Middleware para validação de status de usuário).
        ├── isAdmin.js (Middleware para validação de administradores).

    ├── Routes/
  
        ├── index.routes.js (Arquivo principal para importação e exportação de rotas).
        ├── user.routes.js (Rotas de usuário).
        ├── admin.routes.js (Rotas de administrador).
    
    ├── server.js (Arquivo principal onde está rodando o servidor).

- prisma/
  
    ├── schema.prisma

# ©2025 - Luiz H. Araujo.
