import { UserService } from '../../services/userservice';
import { authOptions } from '../auth/[...nextauth]/options';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        // if (!token) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }

       
        
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; roleId: string };
        // } catch (err) {
        //     return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        // }
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = params.id;
        const user = await UserService.getUserById(userId);
        return NextResponse.json(user, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        // if (!token) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; roleId: string };
        // } catch (err) {
        //     return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        // }
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const userId = params.id;
        const { name, username, email } = await request.json();
        const updatedUser = await UserService.updateUser(userId, { name, username, email });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        // if (!token) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; roleId: string };
        // } catch (err) {
        //     return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        // }
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }


        const userId = params.id;
        await UserService.deleteUser(userId);
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}