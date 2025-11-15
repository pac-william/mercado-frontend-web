"use client"

import { Lens } from "@/components/ui/lens";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
    imageSrc: string;
    alt: string;
}

export default function ProductImage({ imageSrc, alt }: ProductImageProps) {
    const [hovering, setHovering] = useState(false);

    return (
        <Lens
            hovering={hovering}
            setHovering={setHovering}
            zoomFactor={1.5}
            lensSize={170}
        >
            <Image
                src={imageSrc}
                alt={alt}
                className="object-cover"
                fill
                quality={100}
            />
        </Lens>
    );
}

