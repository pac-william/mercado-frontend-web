import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

export default async function MyLayout({ children }: { children: React.ReactNode }) {
    const session = await auth0.getSession();
    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="flex flex-col flex-grow h-0">
            {children}
        </div>
    )
}