import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";
import { auth0 } from "@/lib/auth0";
import { getUserByAuth0Id } from "@/actions/user.actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth0.getSession();
    
    if (!session) {
        redirect('/auth/login?market=true');
    }

    const auth0Id = session.user?.sub;
    if (!auth0Id) {
        redirect('/auth/login?market=true');
    }

    try {
        const profile = await getUserByAuth0Id(auth0Id);
        
        if (profile.role !== 'MARKET_ADMIN' && profile.role !== 'ADMIN') {
            redirect('/');
        }
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        redirect('/auth/login?market=true');
    }

    return (
        <div className="flex flex-1 flex-col h-screen">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}