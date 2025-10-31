import { getProducts } from "@/actions/products.actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SuggestionCard({ title, productName }: { title: string, productName: string }) {

    const { products } = await getProducts({ name: productName, size: 20 });


    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {products.map((product, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline">{product.category?.name}</Badge>
                            <span className="text-card-foreground">{product.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
