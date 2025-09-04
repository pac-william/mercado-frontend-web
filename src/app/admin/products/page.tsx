import Link from "next/link";

export default function Products() {
    return (
        <div>
            <h1>Products</h1>
            <Link href="/admin/products/create">
                <h1>Create Product</h1>
            </Link>
        </div>
    )
}