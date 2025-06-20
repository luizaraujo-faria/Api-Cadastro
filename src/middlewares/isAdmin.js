import jwt from 'jsonwebtoken';

export const isAdmin = async (req, res, next) => {

    if(req.user.user_role !== 'admin'){
        return res.status(403).json({ message: 'Acesso restrito apenas para administradores!' });
    };

    next();
};