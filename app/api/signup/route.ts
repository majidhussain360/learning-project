import { AuthService } from '../../services/authservice';
import { NextRequest,NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password, name, username, roleName } = await request.json();
        const result = await AuthService.signup(name, username, email, password, roleName);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

