import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError.js';
import { validateEmail, validatePassword, validateUserId } from '../utils/validators.js';
import { checkExistingUser, checkRegisteredUser } from '../utils/dbHelpers.js';
import { UserHistoryService } from './userHistoryService.js';

export class UserService{

    static async userRegister({ name, email, password }){

        if(!name || !email || !password){
            throw new AppError('Todos os campos são obrigatórios!', 400);
        }

        validateEmail(email);
        validatePassword(password);

        try{
            await checkRegisteredUser(email);

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.tbuser.create({
                data: { user_name: name, email, user_password: hashPassword } 
            });

            await UserHistoryService.createUserHistory({
                userId: newUser.id,
                action: 'create_account',
                status: 'sucesso',
                details: `Usuário ${email} se cadastrou.`
            });

            return newUser;    
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: null,
                    action: 'create_account',
                    status: 'falha',
                    details: `Usuário ${email} tentou se cadastrar. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de cadastro', logError);
            }

            console.error('Falha ao cadastrar!', err);
            throw err;
        }
    }

    static async userLogin({ email, password }){

        if(!email || !password){
            throw new AppError('Todos os campos devem ser informados!', 400);
        }

        let existingUser;

        try{
            existingUser = await checkExistingUser(email);

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

            await UserHistoryService.createUserHistory({
                userId: existingUser.id,
                action: 'login',
                status: 'sucesso',
                details: `Usuário ${email} realizou login.`
            });

            return token;
        }
        catch(err){
            try{
                UserHistoryService.createUserHistory({
                    userId: existingUser?.id || null,
                    action: 'login',
                    status: 'falha',
                    details: `Usuário: ${email}. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de login!', logError);
            }

            console.error('Falha ao realizar login!', err);
            throw err;
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

            await UserHistoryService.createUserHistory({
                userId: autenticatedId,
                action: 'search_account',
                status: 'sucesso',
                details: `Usuário ${user.email} buscou seus dados.`
            });

            return formattedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: autenticatedId,
                    action: 'search_account',
                    status: 'falha',
                    details: `Usuário ${autenticatedId.email} tentou buscar seus dados. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de busca de dados!', logError);
            }

            console.error('Falha ao buscar dados de usuário!', err);
            throw err;
        }
    }

    static async updateUser(userId, autenticatedId, { name, email, password }){

        validateUserId(userId, autenticatedId);

        try{
            await checkExistingUser(undefined, autenticatedId);

            const updatedFields = {};
            const changes = [];

            if(name){
                updatedFields.user_name = name;
                changes.push('Nome');
            }

            if(email){
                validateEmail(email);
                await checkRegisteredUser(email);
                updatedFields.email = email; 
                changes.push('Email');
            }

            if(password){
                validatePassword(password);
                const hashPassword = await bcrypt.hash(password, 10);
                updatedFields.user_password = hashPassword;
                changes.push('Senha');
            }

            const updatedUser = await prisma.tbuser.update({ where: { id: autenticatedId }, data: updatedFields });
            
            await UserHistoryService.createUserHistory({
                userId: autenticatedId,
                action: 'update_account',
                status: 'sucesso',
                details: `Usuário ${email} atualizou seu(s): ${changes.join(', ')}.`
            });

            return updatedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: autenticatedId || null,
                    action: 'update_account',
                    status: 'falha',
                    details: `Usuário ${email} tentou atualizar seu(s) dado(s). Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de atualização de dados!', logError);
            }

            console.error('Falha ao atualizar dados!', err);
            throw err;
        }
    }

    static async deleteUser(userId, autenticatedId){
         
        validateUserId(userId, autenticatedId);

        try{
            await checkExistingUser(undefined, autenticatedId);

            const deletedUser = await prisma.tbuser.delete({ where: { id: autenticatedId } });
            
            await UserHistoryService.createUserHistory({
                userId: autenticatedId,
                action: 'delete_account',
                status: 'sucesso',
                details: `Usuário ${autenticatedId.email} deletou seus dados.`
            });

            return deletedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: autenticatedId || null,
                    action: 'delete_account',
                    status: 'falha',
                    details: `Usuário ${autenticatedId} tentou deletar seus dados. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de exclusão de usuário!', logError);
            }
            
            console.error('Falha ao deletar usuário!', err);
            throw err;
        }
    }
}