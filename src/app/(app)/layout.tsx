import { getUserByAuth0Id } from "@/actions/user.actions";
import { auth0 } from "@/lib/auth0";
import AdminHeader from "../admin/components/AdminHeader";
import Header from "../components/Header";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth0.getSession();

    let isAdmin = false;
    if (session?.user?.sub) {
        try {
            const user = session.user as { app_metadata?: { role?: string }; user_metadata?: { role?: string } };
            const roleFromToken = user?.app_metadata?.role || user?.user_metadata?.role;

            if (roleFromToken) {
                isAdmin = roleFromToken === 'MARKET_ADMIN' || roleFromToken === 'ADMIN';
            } else {
                try {
                    const profile = await getUserByAuth0Id(session.user.sub);
                    isAdmin = profile.role === 'MARKET_ADMIN' || profile.role === 'ADMIN';
                } catch (error) {
                    console.error('Erro ao buscar role do backend:', error);
                    isAdmin = false;
                }
            }
        } catch (error) {
            console.error('Erro ao verificar role:', error);
            isAdmin = false;
        }
    }

    return (
        <div className="flex flex-1 flex-col h-screen bg-background text-foreground">
            {isAdmin ? <AdminHeader /> : <Header />}
            <div className="flex flex-1 flex-col gap-4">
                {children}
            </div>
        </div >
    )
}