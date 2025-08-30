import banner_01 from "@/assets/hero/Social_media_banner_here_has_savings_for_products_on_great_deals.jpg";
import Image from "next/image";

export default function HeroSection() {
    return (
        <div className="w-full h-[400px]">
            <Image src={banner_01} alt="Hero Section" width={1000} height={1000} className="w-full h-full object-cover" />
        </div>
    )
}