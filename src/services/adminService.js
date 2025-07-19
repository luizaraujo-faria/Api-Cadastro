import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError.js';
import { validateEmail, validatePassword } from '../utils/validators.js';
import { checkExistingUser, checkRegisteredUser } from '../utils/dbHelpers.js';
import { UserHistoryService } from './userHistoryService.js';
import { UserAction, ActionStatus } from '../constants/userHistory.js';

export class AdminService{

    static async adminRegister(admin, { name, email, password, role}){

        if(!name || !email || !password || !role){
            throw new AppError('Todos os campos são obrigatórios!', 400);
        }

        validateEmail(email);
        validatePassword(password);

        try{
            await checkRegisteredUser(email);

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.tbuser.create({ data: { user_name: name, email, user_password: hashPassword } });
            
            await UserHistoryService.createUserHistory({
                userId: admin.id,
                action: UserAction.CREATE,
                status: ActionStatus.SUCCESS,
                details: `Usuário ${newUser.email} criado pelo admin ${admin.email}.`
            });

            return newUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: admin.id,
                    action: UserAction.CREATE,
                    status: ActionStatus.FAILED,
                    details: `Admin ${admin.email} tentou cadastrar um usuário. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de criação de usuário!', logError);
            }

            console.error('Falha ao cadastrar administrador!', err);
            throw err;
        }
    }

    static async getAllUsers(admin){

        try{
            const users = await prisma.tbuser.findMany();

            console.log('usuários no sistema:', users);

            const sanitizedUsers = users.map(({ user_password: _, ...user}) => {
                return {
                    ...user,
                    createdAt: user.createdAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }
            });

            console.log('Usuários sanitizados:', sanitizedUsers)
            if(sanitizedUsers.length === 0){
                throw new AppError('Nenhum usuário encontrado!', 404);
            }

            await UserHistoryService.createUserHistory({
                userId: admin.id,
                action: UserAction.SEARCH,
                status: ActionStatus.SUCCESS,
                details: `Admin ${admin.email} buscou os usuários no sistema.`
            });

            return sanitizedUsers;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: admin.id,
                    action: UserAction.SEARCH,
                    status: ActionStatus.FAILED,
                    details: `Admin ${admin.email} tentou buscar os usuários no sistema. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar busca de usuários no sistema!', logError);
            }

            console.error('Falha ao carregar usuários!', err);
            throw err;
        }
    }

    static async getUserByEmail(admin, userEmail){

        validateEmail(userEmail);

        try{
            const existingUser = await checkExistingUser(userEmail);

            const { user_password: _, ...rest } = existingUser;

            const sanitizedUser = {
                ...rest,
                createdAt: rest.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            };

            await UserHistoryService.createUserHistory({
                userId: admin.id,
                action: UserAction.SEARCH,
                status: ActionStatus.SUCCESS,
                details: `Admin ${admin.email} buscou pelo usuários ${userEmail}.`
            });

            return sanitizedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: admin.id,
                    action: UserAction.SEARCH,
                    status: ActionStatus.FAILED,
                    details: `Admin ${admin.email} tentou buscar pelo email ${userEmail}. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de busca de usuário!', logError);
            }

            console.error('Falha ao buscar usuário!', err);
            throw err;
        }
    }

    static async adminUpdateUser(admin, userEmail, { name, email, password, role, status }){;

        validateEmail(userEmail);

        if(!name && !email && !password && !role && !status){
            throw new AppError('Ao menos um campo deve ser informado!', 400);
        }

        try{
            await checkExistingUser(userEmail);

            const updatedFields = {};
            const changes = [];
            
            if(name){
                updatedFields.user_name = name;
                changes.push('Nome');
            };
            
            if(email){
                validateEmail(email);
                updatedFields.email = email; 
                changes.push('Email');
            };
            
            if(password){
                validatePassword(password);
                const hashPassword = await bcrypt.hash(password, 10);
                updatedFields.user_password = hashPassword;
                changes.push('Senha');
            };

            if(role){
                const validRoles = ['cliente', 'admin'];
                if(!validRoles.includes(role)) {
                    throw new AppError('Tipo de usuário inválido!', 400);
                }
                updatedFields.user_role = role;
                changes.push('Tipo de conta');
            }

            if(status){
                const validStatus = ['ativo', 'inativo', 'banido'];
                if(!validStatus.includes(status)){
                    throw new AppError('Status de usuário inválido!', 400);
                }
                updatedFields.user_status = status;
                changes.push('Status')
            }

            const updatedUser = await prisma.tbuser.update({ where: { email: userEmail }, data: updatedFields, });

            await UserHistoryService.createUserHistory({
                userId: admin.id,
                action: UserAction.UPDATE,
                status: ActionStatus.SUCCESS,
                details: `Admin ${admin.email} atualizou o(s) dado(s): ${changes.join(', ')} do usuário ${userEmail}.`
            });

            return updatedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: admin.id,
                    action: UserAction.UPDATE,
                    status: ActionStatus.FAILED,
                    details: `Admin ${admin.email} tentou atualizar os dados do usuário ${userEmail}. Erro: ${err.message}`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha na atualização de usuário!', logError);
            }

            console.error('Falha ao atualizar dados do usuário!', err);
            throw err;
        }
    }

    static async adminDeleteUser(admin, userEmail){

        try{
            await checkExistingUser(userEmail);

            const deletedUser = await prisma.tbuser.delete({ where: { email: userEmail } });

            await UserHistoryService.createUserHistory({
                userId: admin.id,
                action: UserAction.CREATE,
                status: ActionStatus.SUCCESS,
                details: `Admin ${admin.email} deletou o usuário ${userEmail}.`
            });

            return deletedUser;
        }
        catch(err){
            try{
                await UserHistoryService.createUserHistory({
                    userId: admin.id,
                    action: UserAction.DELETE,
                    status: ActionStatus.FAILED,
                    details: `Admin ${admin.email} tentou deletar o usuário ${userEmail}.`
                });
            }
            catch(logError){
                console.error('Erro ao registrar falha de exclusão de usuários!', logError);
            }

            console.error('Falha ao deletar usuário!', err);
            throw err;
        }
    }
}