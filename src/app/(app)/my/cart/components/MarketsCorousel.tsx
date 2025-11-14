import { Market } from "@/app/domain/marketDomain"
import { formatPrice } from "@/app/utils/formatters"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"


export default function MarketsCorousel({ markets }: { markets: Market[] }) {
    return (
        <div>
            {markets.length > 0 && (
                <Carousel className="w-full">
                    <CarouselContent className="flex flex-1">
                        {markets.slice(0, 8).map((market) => {
                            return (
                                <CarouselItem key={market.id} className="max-w-[320px] min-w-[320px] basis-1/4">
                                    <Card className="flex flex-1 flex-row gap-2 p-4 shadow-none bg-card border-border">
                                        <Avatar className="w-10 h-10 shadow-md">
                                            <AvatarImage src={market.profilePicture} alt={market.name} width={100} height={100} className="rounded-full" />
                                            <AvatarFallback className="bg-primary text-primary-foreground">{market.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-card-foreground font-medium">{market.name}</span>
                                            <span className="text-sm text-muted-foreground">Total: {formatPrice(0)}</span>
                                            <span className="text-sm text-muted-foreground">Distância: {0}km</span>
                                        </div>
                                    </Card>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                </Carousel>
            )}  
        </div>
    )
}