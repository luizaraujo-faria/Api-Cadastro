import { AppError } from './appError.js';
import prisma from '../lib/prismaClient.js';

export const checkExistingUser = async (userId) =>{

    const existingUser = await prisma.tbuser.findUnique({ where: { id: userId } });
    
    if(!existingUser){
        throw new AppError('Usuário não encontrado!', 404);
    }
    
    return existingUser;
}