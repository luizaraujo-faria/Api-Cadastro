import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class UserController{

    async userRegister(req, res){
        const { name, email, password } = req.body;

        try{
            if(!name || !email || !password){
                return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
            };

            const existingUser = await prisma.tbuser.findUnique({ where: { email: email } });
            if(existingUser){
                return res.status(400).json({ message: 'Usuário já existente!' });
            };

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if(!emailRegex.test(email)){
                return res.status(400).json({ message: 'Email inválido!' });
            };

            if(password.length < 8){
                return res.status(400).json({ message: 'Senha muito curta! use uma senha mais segura!' });
            };

            const hashPassword = await bcrypt.hash(password, 10);

            const user = await prisma.tbuser.create({ data: { user_name: name, email, user_password: hashPassword } });
            return res.status(201).json({ message: 'Cadastro efetuado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao cadastrar!', err);
            return res.status(500).json({ message: 'Falha interna ao realizar cadastro!', err});
        };
    };

    async userLogin(req, res){
        const { email, password } = req.body;

        try{
            if(!email || !password){
                return res.status(400).json({ message: 'Todos os campos devem ser preenchidos!' });
            };

            const existingUser = await prisma.tbuser.findUnique({ where: { email } });
            if(!existingUser){
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            };

            const isMatch = await bcrypt.compare(password, existingUser.user_password);
            if(!isMatch){
                return res.status(401).json({ message: 'Senha incorreta!' });
            };

            const token = jwt.sign(
                { 
                    id: existingUser.id, 
                    email: existingUser.email, 
                    user_role: existingUser.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            return res.status(200).json({ message: 'Login realizado com sucesso!', token });
        }
        catch(err){
            console.error('Falha ao realizar login!', err);
            return res.status(500).json({ message: 'Falha interna ao realizar login!' });
        }
    };

    async getUser(req, res){
        const userId = parseInt(req.params.id);

        if(!userId || isNaN(userId)){
            return res.status(400).json({ message: 'ID de usuário inválido!' });
        };

        try{
            const user = await prisma.tbuser.findUnique({ 
                where: { id: userId },
                select: {
                  id: true,
                  user_name: true,
                  email: true,
                  user_role: true,
                  createdAt: true
                } 
            });
            if(!user){
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            };

            const formattedUser = {
                ...user,
                createdAt: user.createdAt.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })
            }

            return res.status(200).json({ message: 'Dados buscados com sucesso!', formattedUser });
        }
        catch(err){
            console.error('Falha ao buscar dados de usuário!', err);
            return res.status(500).json({ message: 'Falha interna ao buscar dados!' });
        };
    };

    async updateUser(req, res){
        const userId = parseInt(req.params.id);
        const { name, email, password } = req.body;

        if(!userId || isNaN(userId)){
            return res.status(400).json({ message: 'ID de usuário inválido!' });
        };

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
            if(!existingUser){
                return res.status(404).json({ message: 'Usuário não existe!' });
            };

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

            const user = await prisma.tbuser.update({ where: { id: userId }, data, });
            return res.status(200).json({ message: 'Dados atualizados com sucesso!' });
        }
        catch(err){
            console.error('Falha ao atualizar dados!', err);
            return res.status(500).json({ message: 'Falha interna ao atualizar dados!' });
        };
    };

    async deleteUser(req, res){
        const userId = parseInt(req.params.id);
         
        if(!userId || isNaN(userId)){
            return res.status(400).json({ message: 'ID de usuário inválido!' });
        };

        try{
            const existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
            if(!existingUser){
                return res.status(404).json({ message: 'Usuário não inexistente!' });
            };

            await prisma.tbuser.delete({ where: { id: userId } });
            return res.status(204).json({ message: 'Usuário deletado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            return res.status(500).json({ message: 'Falha interna ao deletar usuário!' });
        };
    };
};