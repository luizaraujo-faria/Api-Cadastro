import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import routes from './routes/index.routes.js';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());

//Acessando cada rota da aplicação dinamicamente
routes.forEach(({ prefix, router }) => {
    app.use(`/api${prefix}`, router);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}.`);
});