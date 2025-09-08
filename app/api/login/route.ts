import { AuthService } from "../../services/authservice";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { usernameOrEmail, password } = await request.json();
        const result = await AuthService.login(usernameOrEmail, password);
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
