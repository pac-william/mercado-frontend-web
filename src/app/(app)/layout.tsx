import Header from "../components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-1 flex-col h-screen">
            <Header />
            <div className="flex flex-1 flex-col gap-4">
                {children}
            </div>
        </div >
    )
}