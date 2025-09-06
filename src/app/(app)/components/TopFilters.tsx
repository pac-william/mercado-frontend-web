import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SearchField from "./SeachField";

export default function TopFilters() {

    return (
        <div className="flex flex-row gap-4 justify-between">
            <SearchField paramName="name" />
            <Select>
                <SelectTrigger className="w-[100px] bg-background">
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="1">10</SelectItem>
                    <SelectItem value="2">20</SelectItem>
                    <SelectItem value="3">30</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}