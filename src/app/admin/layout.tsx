import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col h-screen">
            <AdminHeader />
            {children}
        </div>
    )
}