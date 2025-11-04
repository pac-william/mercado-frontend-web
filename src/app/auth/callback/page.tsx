import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export default async function AuthCallbackPage() {
    const session = await auth0.getSession();
    
    if (!session) {
        redirect('/auth/login');
    }

    const auth0Id = session.user?.sub;
    if (!auth0Id) {
        redirect('/auth/login');
    }

    try {
        const profile = await getUserByAuth0Id(auth0Id);
        
        if (profile.role === 'MARKET_ADMIN' || profile.role === 'ADMIN') {
            redirect('/admin');
        }
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
    }

    redirect('/');
}

