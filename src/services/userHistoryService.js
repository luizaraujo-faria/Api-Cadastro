import prisma from '../lib/prismaClient.js';

export class UserHistoryService{

    static async createUserHistory({userId, action, status, details}){

        return await prisma.tbuserhistory.create({ 
            data: { user_id: userId, user_action: action, details, action_status: status} 
        });
    }
}