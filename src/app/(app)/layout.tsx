import Header from "../components/Header";
import HistorySideMenu from "../components/HistorySideMenu";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-1 h-screen">
            <HistorySideMenu />
            <div className="flex flex-col flex-1">
                <Header />
                {children}
            </div>
        </div >
    )
}