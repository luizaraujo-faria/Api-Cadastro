import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkUserStatus } from '../middlewares/checkUserStatus.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import controllers from '../controllers/indexController.js';

const router = express.Router();
const { adminController } = controllers;

//Rotas protegidas para administradores
router.post('/users', authenticate, checkUserStatus, isAdmin, adminController.adminRegister);
router.get('/users', authenticate, checkUserStatus, isAdmin, adminController.getAllUsers);
router.get('/users/email', authenticate, checkUserStatus, isAdmin, adminController.getUserByEmail);
router.patch('/users', authenticate, checkUserStatus, isAdmin, adminController.adminUpdateUser);
router.delete('/users', authenticate, checkUserStatus, isAdmin, adminController.adminDeleteUser);

//Exportanto prefixo e suas rotas
export default {
    prefix: '/admin',
    router
}