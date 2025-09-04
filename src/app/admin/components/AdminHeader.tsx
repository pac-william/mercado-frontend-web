import Link from "next/link";

export default function AdminHeader() {
    return (
        <div className="flex flex-row gap-4 p-4">
            <Link href="/admin" className="text-2xl font-bold">
                <h1>Admin</h1>
            </Link>
            <Link href="/admin/dashboard" className="text-2xl font-bold">
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
        </div >
    )
}