"use client"

import { useEffect, useState } from "react"

import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from "@/components/ui/cropper"
import { Slider } from "@/components/ui/slider"

export default function CropperZoomSlider({ image }: { image: string }) {
  const [zoom, setZoom] = useState(1)

  // Reset zoom when image changes
  useEffect(() => {
    setZoom(1)
  }, [image])

  return (
    <div className="flex flex-col items-center gap-2">
      <Cropper
        className="h-80 w-80"
        image={image}
        zoom={zoom}
        onZoomChange={setZoom}
      >
        <CropperDescription />
        <CropperImage />
        <CropperCropArea  />
      </Cropper>
      <div className="mx-auto flex w-full items-center gap-1">
        <Slider
          defaultValue={[1]}
          value={[zoom]}
          min={1}
          max={3}
          step={0.1}
          onValueChange={(value) => setZoom(value[0])}
          aria-label="Zoom slider"
        />
        <output className="block w-10 shrink-0 text-right text-sm font-medium tabular-nums">
          {parseFloat(zoom.toFixed(1))}x
        </output>
      </div>
    </div>
  )
}
