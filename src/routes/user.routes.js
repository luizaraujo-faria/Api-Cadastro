import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { userController } from '../controllers/indexController.js';

const router = express.Router();

//Rotas públicas
router.post('/register', userController.userRegister);
router.post('/login', userController.userLogin);

//Rotas privadas
router.get('/get/:id', authenticate, userController.getUser);
router.patch('/update/:id', authenticate, userController.updateUser);
router.delete('/delete/:id', authenticate, userController.deleteUser);

//Exportanto prefixo e suas rotas
export default {
    prefix: '/users',
    router
};