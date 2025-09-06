import Link from "next/link";

export default function AdminHeader() {
    return (
        <div className="flex flex-row gap-4 p-4 bg-background border-b border-border">
            <div className="flex flex-row gap-4 container mx-auto items-center">
                <Link href="/admin" className="text-2xl font-bold">
                    <h1>Admin</h1>
                </Link>
                <Link href="/admin/dashboard" className="ml-auto">
                    <h1>Dashboard</h1>
                </Link>
                <Link href="/admin/products">
                    <h1>Products</h1>
                </Link>
                <Link href="/admin/users">
                    <h1>Users</h1>
                </Link>
                <Link href="/admin/settings">
                    <h1>Settings</h1>
                </Link>
            </div>
        </div >
    )
}