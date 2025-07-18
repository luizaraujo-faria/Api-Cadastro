import { AppError } from './appError.js';
import prisma from '../lib/prismaClient.js';

export const checkExistingUser = async (email, userId) => {

    if(!email && !userId){
        throw new AppError('Email ou ID devem ser informados!', 400);
    }

    let existingUser;

    if(email){
        existingUser = await prisma.tbuser.findUnique({ where: { email: email } });
    }

    if(userId){
        existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
    }

    if(!existingUser){
        throw new AppError('Usuário não encontrado!', 404);
    }
    
    return existingUser;
}

export const checkRegisteredUser = async (email) => {
    
    const registeredUser = await prisma.tbuser.findUnique({ where: { email } });

    if(registeredUser){
        throw new AppError('Usuário já cadastrado neste email!', 400);
    }

    return registeredUser;
}