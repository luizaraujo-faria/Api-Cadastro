# API-Cadastro

API RESTFull para gestão de usuários baseada em arquitetura em camadas. Foco nas interações dos usuários com as rotas da aplicação e a administração e gerência dos mesmos pelos administradores.

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
  
        ├── adminController.js (Controlador da classe e metodos do administrador).
        ├── indexController.js (Arquivo principal para importação e exportação de controladores).
        ├── userController.js (Controlador da classe e metodos do usuário).

    ├── Lib/
  
        ├── prismaClient.js (Armazena a instancia única do Prisma - Conexão com o banco).

    ├── Middlewares/
  
        ├── authmiddleware.js (Middleware de autenticação de usuário).
        ├── checkUserStatus.js (Middleware para validação de status de usuário).
        ├── isAdmin.js (Middleware para validação de administradores).

    ├── Routes/
  
        ├── admin.routes.js (Rotas de administrador).
        ├── index.routes.js (Arquivo principal para importação e exportação de rotas).
        ├── user.routes.js (Rotas de usuário).
    
    ├── Services/
  
        ├── adminService.js (Lógica e regras de negócio de administrador).
        ├── userService.js (Lógica e regras de negócio de usuários).

    ├── Utils/
  
        ├── appError.js (Classe utilitária para erros).
        ├── dbHelpers.js (Funções utilitárias para auxiliar com operações no banco de dados).
        ├── validators.js (Funções utilitárias para verificações).   

    ├── server.js (Arquivo principal executando o servidor).

- prisma/
  
    ├── schema.prisma (Arquivo das entidades do banco).

# Instalação

- git clone https://github.com/luizaraujo-faria/Api-Cadastro

- npm install

- criar um .env com:
  
        DATABASE_URL - < mysql://usuario:senha@localhost:3306/nome_do_banco >
  
        JWT_SECRET - < chave secreta >
  
        JWT_EXPIRES_IN - < tempo de duração >
  
        PORT - < porta do servidor >

- npm run dev

# ©2025 - Luiz H. Araujo.
