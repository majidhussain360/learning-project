import { UserService } from '../../../services/userservice';
import { authOptions } from '../../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

export async function GET(request: NextRequest, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = context.params.id;
        const user = await UserService.getUserById(userId);
        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = context.params.id;
        const { name, username, email } = await request.json();
        const updatedUser = await UserService.updateUser(userId, { name, username, email });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const userId = context.params.id;
        await UserService.deleteUser(userId);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}