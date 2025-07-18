import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.routes.js';
import prisma from './lib/prismaClient.js';

dotenv.config();
const app = express();

app.use(express.json());

// Acessando cada rota da aplicação dinamicamente
routes.forEach(({ prefix, router }) => {
    app.use(`/api${prefix}`, router);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}.`);
});

// Encerra conexão com Prisma ao finalizar o servidor
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});