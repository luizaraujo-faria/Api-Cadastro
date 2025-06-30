import { UserController } from './userController.js';
import { AdminController } from './adminController.js';

const controllers = {
    userController: new UserController(),
    adminController: new AdminController(),
};

export default controllers;