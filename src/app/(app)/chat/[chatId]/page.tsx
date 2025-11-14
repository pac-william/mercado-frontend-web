import Chat from "./components/Chat";

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { chatId } = await params;
    return (
        <div>
            <Chat chatId={chatId} />
        </div>
    )
}