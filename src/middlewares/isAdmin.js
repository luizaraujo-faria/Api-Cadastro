export const isAdmin = (req, res, next) => {
      
    if (!req.user || !req.user.user_role) {
        return res.status(401).json({ message: 'Usuário não autenticado.' });
    }

    if(req.user?.user_role !== 'admin'){
        return res.status(403).json({ message: 'Acesso restrito apenas para administradores!' });
    };

    next();
};