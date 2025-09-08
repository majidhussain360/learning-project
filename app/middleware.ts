import {NextRequest, NextResponse} from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from "jsonwebtoken"
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();
const prisma = new PrismaClient();




export async function middleware(request: NextRequest) {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
        const blacklistedToken = await prisma.blacklistedToken.findUnique({ where: { token } });
        if (blacklistedToken) {
            return NextResponse.json({ message: "Token is blacklisted" }, { status: 401 });
        }
        return NextResponse.next();
    } catch (error) {
        return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }
}

export const config = {
  matcher: [
    "/api/user/:path*",
    "/api/users/:path*",
    // Add more protected routes here if needed
  ],
};