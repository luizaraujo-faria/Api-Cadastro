export const checkUserStatus = (req, res, next) => {
    const { user } = req;

    if(!user){
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    if(user.user_status === 'banido'){
        return res.status(401).json({ message: 'Seu acesso foi banido! Contate o suporte.' });
    }

    if(user.user_status === 'inativo'){
        return res.status(401).json({ message: 'Seu acesso está inativo! Contate o suporte.' });
    }

    next();
}