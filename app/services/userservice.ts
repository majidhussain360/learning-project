import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class UserService {
    static async getUserById(id: string){
        return await prisma.user.findUnique({ where: {id}});
    }
    static async getAllUsers(){
        return await prisma.user.findMany();
    }
    static async deleteUser(id: string){
        return await prisma.user.delete({ where: {id}});
    }
    static async updateUser(id: string, data: { name?: string; username?: string; email?: string; password?: string; }){
        return await prisma.user.update({ where: {id}, data });
    }
}