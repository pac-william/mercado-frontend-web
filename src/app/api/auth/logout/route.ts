import { NextResponse } from 'next/server';
import { clearAccessTokenCookie } from '../_utils';

export async function POST() {
    // Temporariamente sempre ativo para teste
    // if (process.env.USE_MOCK !== 'true') {
    //     return NextResponse.json({ message: 'Mock desabilitado' }, { status: 501 });
    // }

    clearAccessTokenCookie();
    return NextResponse.json({ message: 'Logout realizado' }, { status: 200 });
}


