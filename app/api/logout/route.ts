import { AuthService } from "../../services/authservice";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        await AuthService.logout(token);
        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
