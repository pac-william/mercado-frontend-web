import AdminHeader from "./components/AdminHeader";
import RequireRole from "@/components/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <RequireRole roles="admin">
            <div className="flex flex-1 flex-col h-screen">
                <AdminHeader />
                {children}
            </div>
        </RequireRole>
    )
}