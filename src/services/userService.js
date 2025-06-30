import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import { validateEmail, validatePassword, validateUserId } from '../utils/validators.js';
import { checkExistingUser } from '../utils/dbHelpers.js';

export class UserService{

    static async userRegister({ name, email, password }){

        if(!name || !email || !password){
            throw new AppError('Todos os campos são obrigatórios!', 400);
        }

        validateEmail(email);
        validatePassword(password);

        try{
            const registeredUser = await prisma.tbuser.findUnique({ where: { email: email } });
            if(registeredUser){
                throw new AppError('Email já cadastrado!', 400);
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.tbuser.create({
                data: { user_name: name, email, user_password: hashPassword } 
            });

            return newUser;    
        }
        catch(err){
            console.error('Falha ao cadastrar!', err);
            throw new Error(`Erro no serviço: ${err.message}`);
        }
    }

    static async userLogin({ email, password }){

        if(!email || !password){
            throw new AppError('Todos os campos devem ser informados!', 400);
        }

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { email } });
            if(!existingUser){
                throw new AppError('Usuário não encontrado!', 404);
            }

            const isMatch = await bcrypt.compare(password, existingUser.user_password);
            if(!isMatch){
                throw new AppError('Senha incorreta!', 400);
            }

            const token = jwt.sign(
                { 
                    id: existingUser.id, 
                    email: existingUser.email, 
                    user_role: existingUser.user_role,
                    user_status: existingUser.user_status
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            )

            return token;
        }
        catch(err){
            console.error('Falha ao realizar login!', err);
            throw new Error(`Falha no serviço: ${err.message}`);
        }
    }

    static async getUser(userId, autenticatedId){

        validateUserId(userId, autenticatedId);

        try{
            const user = await prisma.tbuser.findUnique({ 
                where: { id: autenticatedId },
                select: {
                  id: true,
                  user_name: true,
                  email: true,
                  user_role: true,
                  createdAt: true
                } 
            });
            if(!user){
                throw new AppError('Usuário não encontrado!', 404);
            }

            const formattedUser = {
                ...user,
                createdAt: user.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            }

            return formattedUser;
        }
        catch(err){
            console.error('Falha ao buscar dados de usuário!', err);
            throw new Error(`Falha no serviço: ${err.message}`);
        }
    }

    static async updateUser(userId, autenticatedId, { name, email, password }){

        validateUserId(userId, autenticatedId);

        try{
            checkExistingUser(autenticatedId);

            const data = {};

            if(name){
                data.user_name = name;
            }

            if(email){
                validateEmail(email);
                data.email = email; 
            }

            if(password){
                validatePassword(password);
                const hashPassword = await bcrypt.hash(password, 10);
                data.user_password = hashPassword;
            }

            const updatedUser = await prisma.tbuser.update({ where: { id: autenticatedId }, data, });
            return updatedUser;
        }
        catch(err){
            console.error('Falha ao atualizar dados!', err);
            throw new Error(`falha no serviço: ${err.message}`);
        }
    }

    static async deleteUser(userId, autenticatedId){
         
        validateUserId(userId, autenticatedId);

        try{
            checkExistingUser(autenticatedId);

            const deletedUser = await prisma.tbuser.delete({ where: { id: autenticatedId } });
            return deletedUser;
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            throw new Error(`Falha no serviço: ${err.message}`);
        }
    }
}