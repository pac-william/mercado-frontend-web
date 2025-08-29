import Header from "../components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen w-screen gap-4">
            <Header />
            {children}
        </div>
    )
}