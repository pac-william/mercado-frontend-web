import { Loader } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            <Loader size={40} className="animate-spin" />
        </div>
    );
}