import { UserService } from '../services/userService.js';

export class UserController{

    async userRegister(req, res){
        
        try{
            await UserService.userRegister(req.body);
            return res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao cadastrar!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha interna ao realizar cadastro!'});
        }
    }

    async userLogin(req, res){

        try{
            const login = await UserService.userLogin(req.body);
            return res.status(200).json({ message: 'Login realizado com sucesso!', login });
        }
        catch(err){
            console.error('Falha ao realizar login!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha interna ao realizar login!' });
        }
    }

    async getUser(req, res){

        try{
            const user = await UserService.getUser(parseInt(req.params.id), req.user.id);
            return res.status(200).json({ message: 'Dados buscados com sucesso!', user });
        }
        catch(err){
            console.error('Falha ao buscar dados de usuário!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha interna ao buscar dados!' });
        }
    }

    async updateUser(req, res){

        try{
            await UserService.updateUser(parseInt(req.params.id), req.user.id, req.body);
            return res.status(200).json({ message: 'Dados atualizados com sucesso!' });
        }
        catch(err){
            console.error('Falha ao atualizar dados!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha interna ao atualizar dados!' });
        }
    }

    async deleteUser(req, res){

        try{
            await UserService.deleteUser(parseInt(req.params.id), req.user.id);
            return res.status(204).json({ message: 'Usuário deletado com sucesso!' });
        }
        catch(err){
            console.error('Falha ao deletar usuário!', err);
            return res.status(err.statusCode || 500).json({ message: err.message || 'Falha interna ao deletar usuário!' });
        }
    }
}