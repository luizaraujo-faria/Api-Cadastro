import { AppError } from './appError.js';

export const validateEmail = (email) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(!emailRegex.test(email)){
        throw new AppError('Email fornecido inválido!', 400);
    } 
}

export const validatePassword = (pw) => {

    if(pw.length < 8){
        throw new AppError('Senha deve conter no mínimo 8 caracteres!', 400);
    }
}

export const validateUserId = (id, tokenId) => {

    if(!id || isNaN(id)){
        throw new AppError('ID de usuário inválido!');
    }

    if(tokenId){
        if(id !== tokenId){
            throw new AppError('Acesso negado!', 403);
        }
    }
}