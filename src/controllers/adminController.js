import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class AdminController{

    async adminRegister(req, res){
        const { name, email, password, role } = req.body;

        if(!name || !email || !password || !role){
            return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({ message: 'Email de usuário inválido!' });
        }

        if(password.length < 8){
            return res.status(400).json({ message: 'Senha deve conter no mínimo 8 caracteres!' });
        }

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { email }});
            if(existingUser){
                return res.status(400).json({ message: 'Usuário já cadastrado no sistema!' });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const user = await prisma.tbuser.create({ data: { user_name: name, email, user_password: hashPassword } });
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao cadastrar administrador!', err);
            return res.status(500).json({ message: 'Falha ao cadastrar administrador!' });
        }
    }

    async getAllUsers(req, res){

        try{
            const users = await prisma.tbuser.findMany();
            const sanitizedUsers = users.map(({ user_password, ...user}) => {
                return {
                    ...user,
                    createdAt: user.createdAt.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    })
                }
            });

            if(sanitizedUsers.length === 0){
                return res.status(200).json({ message: 'Nenhum usuário encontrado!', sanitizedUsers });
            }

            return res.status(200).json({ message: 'Usuários carregados com sucesso! ', users: sanitizedUsers });
        }
        catch(err){
            console.error('Falha ao carregar usuários!', err);
            return res.status(500).json({ message: 'Falha ao buscar usuários!' });
        }
    }

    async getById(req, res){
        const userId = parseInt(req.body.id);

        if(!userId || isNaN(userId)){
            return res.status(400).json({ message: 'ID de usuário inválido ou não informado!' });
        }

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
            if(!existingUser){
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            const { user_password, ...rest } = existingUser;

            const sanitizedUser = {
                ...rest,
                createdAt: rest.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            };

            return res.status(200).json({ message: 'Usuário carregado com sucesso!', user: sanitizedUser });
        }
        catch(err){
            console.error('Falha ao buscar usuário!', err);
            return res.status(500).json({ message: 'Falha ao buscar usuário!' });
        }
    }

    async adminUpdateUser(req, res){
        const userId = parseInt(req.body.id);
        const { name, email, password, role, status} = req.body;

        if(!userId || isNaN(userId)){
            return res.status(400).json({ message: 'ID de usuário inválido ou não informado!' });
        }

        if(!name && !email && !password && !role && !status){
            return res.status(400).json({ message: 'Ao menos um campo deve ser informado!' });
        }

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { id: userId }});
            if(!existingUser){
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            const data = {};
            
            if(name){
                data.user_name = name;
            };
            
            if(email){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if(!emailRegex.test(email)){
                    return res.status(400).json({ message: 'Email inválido!' });
                };
                data.email = email; 
            };
            
            if(password){
                if(password.length < 8){
                    return res.status(400).json({ message: 'Sua senha deve conter no mínimo 8 caracteres!' });
                };
                const hashPassword = await bcrypt.hash(password, 10);
                data.user_password = hashPassword;
            };

            if(role){
                const validRoles = ['cliente', 'admin'];
                if(!validRoles.includes(role)) {
                    return res.status(400).json({ message: 'Role inválido!' });
                }
                data.user_role = role;
            }

            if(status){
                const validStatus = ['ativo', 'inativo', 'banido'];
                if(!validStatus.includes(status)){
                    return res.status(400).json({ message: 'Status inválido!' });
                }
                data.user_status = status;
            }

            const updatedUser = await prisma.tbuser.update({ where: { id: userId }, data, });
            return res.status(200).json({ message: 'Dados atualizados com sucesso!' });
        }
        catch(err){
            console.error('Falha ao atualizar dados do usuário!', err);
            return res.status(500).json({ message: 'Falha ao atualizar dados do usuário!' });
        }
    }

    async adminDeleteUser(req, res){
        const userId = parseInt(req.body.id);

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
            if(!existingUser){
                return res.status(404).json({ messgae: 'Usuário não encontrado!' });
            }

            const deletedUser = await prisma.tbuser.delete({ where: { id: userId } });
            return res.status(204).json({ message: 'Usuário excluído com sucesso!' });
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            return res.status(500).json({ message: 'Falha ao deletar usuário!' });
        }
    }
}