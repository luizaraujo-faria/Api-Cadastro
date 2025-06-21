import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkUserStatus } from '../middlewares/checkUserStatus.js';
import controllers from '../controllers/indexController.js';

const router = express.Router();
const { userController } = controllers;

//Rotas públicas
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

//Rotas privadas
router.get('/get/:id', authenticate, checkUserStatus, userController.getUser);
router.patch('/update/:id', authenticate, checkUserStatus, userController.updateUser);
router.delete('/delete/:id', authenticate, checkUserStatus, userController.deleteUser);

//Exportanto prefixo e suas rotas
export default {
    prefix: '/users',
    router
};