import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TopFilters() {

    return (
        <div className="flex flex-row gap-4 justify-between">
            <Select>
                <SelectTrigger className="w-[100px] bg-background border-border text-foreground">
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                    <SelectItem value="1" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">10</SelectItem>
                    <SelectItem value="2" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">20</SelectItem>
                    <SelectItem value="3" className="text-popover-foreground hover:bg-accent hover:text-accent-foreground">30</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}