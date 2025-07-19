import { AdminService } from '../services/adminService.js';

export class AdminController{

    async adminRegister(req, res){

        try{
            await AdminService.adminRegister(req.user, req.body);
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao cadastrar administrador!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha ao cadastrar administrador!' });
        }
    }

    async getAllUsers(req, res){

        try{
            const users = await AdminService.getAllUsers(req.user);
            return res.status(200).json({ message: 'Usuários no sitemas:', users });
        }
        catch(err){
            console.error('Falha ao carregar usuários!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha ao buscar usuários!' });
        }
    }

    async getUserByEmail(req, res){

        try{
            const user = await AdminService.getUserByEmail(req.user, req.body.email);
            return res.status(200).json({ message: 'Usuário carregado com sucesso!', user });
        }
        catch(err){
            console.error('Falha ao buscar usuário!', err);
            return res.status(err.statusCode || 500).json({ message: err.messsage || 'Falha ao buscar usuário!' });
        }
    }

    async adminUpdateUser(req, res){

        try{
            await AdminService.adminUpdateUser(req.user, req.body.userEmail, req.body);
            return res.status(200).json({ message: 'Dados atualizados com sucesso!' });
        }
        catch(err){
            console.error('Falha ao atualizar dados do usuário!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha ao atualizar dados do usuário!' });
        }
    }

    async adminDeleteUser(req, res){

        try{
            await AdminService.adminDeleteUser(req.body.email);
            return res.status(204).json({ message: 'Usuário excluído com sucesso!' });
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha ao deletar usuário!' });
        }
    }
}