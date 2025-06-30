import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkUserStatus } from '../middlewares/checkUserStatus.js';
import { isAdmin } from '../middlewares/isAdmin.js';
import controllers from '../controllers/indexController.js';

const router = express.Router();
const { adminController } = controllers;

//Rotas protegidas para administradores
router.post('/adminregister', authenticate, checkUserStatus, isAdmin, adminController.adminRegister);
router.get('/getall', authenticate, checkUserStatus, isAdmin, adminController.getAllUsers);
router.get('/getbyid', authenticate, checkUserStatus, isAdmin, adminController.getUserById);
router.patch('/adminupdate', authenticate, checkUserStatus, isAdmin, adminController.adminUpdateUser);
router.delete('/admindelete', authenticate, checkUserStatus, isAdmin, adminController.adminDeleteUser);

//Exportanto prefixo e suas rotas
export default {
    prefix: '/admin',
    router
}