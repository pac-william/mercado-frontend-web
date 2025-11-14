import Chat from "./components/Chat";

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { chatId } = await params;
    return (
        <div className="flex flex-1 container mx-auto">
            <Chat chatId={chatId} />
        </div>
    )
}