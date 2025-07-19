import prisma from '../lib/prismaClient.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/appError.js';
import { validateEmail, validatePassword, validateUserId } from '../utils/validators.js';
import { checkExistingUser, checkRegisteredUser } from '../utils/dbHelpers.js';

export class AdminService{

    static async adminRegister({ name, email, password, role}){

        if(!name || !email || !password || !role){
            throw new AppError('Todos os campos são obrigatórios!', 400);
        }

        validateEmail(email);
        validatePassword(password);

        try{
            await checkRegisteredUser(email);

            const hashPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.tbuser.create({ data: { user_name: name, email, user_password: hashPassword } });
            return newUser;
        }
        catch(err){
            console.error('Falha ao cadastrar administrador!', err);
            throw err;
        }
    }

    static async getAllUsers(){

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

            return sanitizedUsers;
        }
        catch(err){
            console.error('Falha ao carregar usuários!', err);
            throw err;
        }
    }

    static async getUserById(userId){

        validateUserId(userId);

        try{
            const existingUser = await checkExistingUser(undefined, userId);

            const { user_password: _, ...rest } = existingUser;

            const sanitizedUser = {
                ...rest,
                createdAt: rest.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            };

            return sanitizedUser;
        }
        catch(err){
            console.error('Falha ao buscar usuário!', err);
            throw err;
        }
    }

    static async adminUpdateUser(userId, { name, email, password, role, status }){;

        validateUserId(userId)

        if(!name && !email && !password && !role && !status){
            throw new AppError('Ao menos um campo deve ser informado!', 400);
        }

        try{
            await checkExistingUser(userId);

            const data = {};
            
            if(name){
                data.user_name = name;
            };
            
            if(email){
                validateEmail(email);
                data.email = email; 
            };
            
            if(password){
                validatePassword(password);
                const hashPassword = await bcrypt.hash(password, 10);
                data.user_password = hashPassword;
            };

            if(role){
                const validRoles = ['cliente', 'admin'];
                if(!validRoles.includes(role)) {
                    throw new AppError('Tipo de usuário inválido!', 400);
                }
                data.user_role = role;
            }

            if(status){
                const validStatus = ['ativo', 'inativo', 'banido'];
                if(!validStatus.includes(status)){
                    throw new AppError('Status de usuário inválido!', 400);
                }
                data.user_status = status;
            }

            const updatedUser = await prisma.tbuser.update({ where: { id: userId }, data, });
            return updatedUser;
        }
        catch(err){
            console.error('Falha ao atualizar dados do usuário!', err);
            throw new Error(`Falha no serviço: ${err.message}`);
        }
    }

    static async adminDeleteUser(userId){

        try{
            await checkExistingUser(userId);

            const deletedUser = await prisma.tbuser.delete({ where: { id: userId } });
            return deletedUser;
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            throw new Error(`Falha no serviço: ${err.message}`);
        }
    }
}