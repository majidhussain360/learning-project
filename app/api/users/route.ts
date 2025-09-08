import { UserService } from "../../services/userservice";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    try {
        // const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        // if (!token) {
        //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        // }
        // try {
        //     const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; roleId: string };
        //     // Optionally, use decoded info for RBAC here
        // } catch (err) {
        //     return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        // }

        const users = await UserService.getAllUsers();
        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}