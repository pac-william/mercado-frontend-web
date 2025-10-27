import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import Image from "next/image"

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string
    name: string
    username: string
    body: string
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <Image className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    )
}

interface MarqueeDemoProps {
    reviews: {
        name: string;
        username: string;
        body: string;
        img: string;
    }[];
}

export function MarqueeDemo({ reviews }: MarqueeDemoProps) {
    return (
        <div className="relative flex-1 w-screen  flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:60s]">
                {reviews.map((review, index) => (
                    <ReviewCard key={`${review.username}-forward-${index}`} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:60s]">
                {reviews.map((review, index) => (
                    <ReviewCard key={`${review.username}-backward-${index}`} {...review} />
                ))}
            </Marquee>
            <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
            <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>
    )
}
