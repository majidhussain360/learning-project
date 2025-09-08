import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

const prisma = new PrismaClient();
config();

export class AuthService {
    static async signup(name: string, username: string, email: string, password: string, roleName: string) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already exists");
        }
        const existingUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUsername) {
            throw new Error("Username already exists");
        }
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) {
            throw new Error("Role not found");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                roleId: role.id,
            },
        });
        return user;
    }

    static async login(usernameOrEmail: string, password: string) {
        let user = await prisma.user.findUnique({ where: { email: usernameOrEmail } });
        if (!user) {
            user = await prisma.user.findUnique({ where: { username: usernameOrEmail } });
        }
        if (!user) {
            throw new Error("Invalid username or password");
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid username or password");
        }
        const token = jwt.sign({ userId: user.id, roleId: user.roleId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        return { token, user };
    }


    static async logout(token: string){
        // In a real-world application, you might want to implement token blacklisting here.
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; roleId: number, exp: number };
        await prisma.blacklistedToken.create({
            data: {
                token,
                expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 3600000),
            },
        });
    }
}