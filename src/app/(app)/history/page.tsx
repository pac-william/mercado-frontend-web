import CartMarketGroup from "@/app/components/CartMarketGroup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products } from "@/lib/mock-data";
import moment from "moment";
import "moment/locale/pt-br";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Smart Market - Histórico',
    description: 'Veja seu histórico de compras',
}

export default function History() {
    const history = Array.from({ length: 3 }).map(() => ({
        date: new Date(2025, 7, 29),
        products: products
    }));
    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <h1 className="text-2xl font-bold">Histórico de compras</h1>
                {
                    history.map((item, index) => (
                        <div className="grid grid-cols-[auto_1fr] gap-4" key={index}>
                            <div className="flex  gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="">{moment(item.date).calendar()}</span>
                                    <span className="text-sm text-muted-foreground">{moment(item.date).calendar()}</span>
                                </div>
                                <div className="flex flex-col flex-1 items-center relative">
                                    <span className={`h-4 w-[2px] bg-primary absolute -top-4 ${index === 0 ? "hidden" : ""}`}></span>
                                    <span className="min-h-4 min-w-4 border-2 border-primary bg-white rounded-full"></span>
                                    <span className={`h-full w-[2px] bg-primary absolute -bottom-4 ${index === history.length - 1 ? "hidden" : ""}`}></span>
                                </div>
                            </div>
                            <CartMarketGroup marketName="Mercado 1" marketAddress="Endereço 1" products={products} />
                        </div>
                    ))
                }
            </div>
        </ScrollArea>
    )
}   