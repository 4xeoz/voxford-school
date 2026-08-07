import Image, { type StaticImageData } from "next/image"
import { cn } from "@/lib/utils"
import { Marquee } from "../Magic/marquee"
import logo1 from "@/public/infinit_scroll/Hult_transparent_logo.png"
import logo2 from "@/public/infinit_scroll/ff9a29211b303d85e387c96c4936a5f6.png"
import logo3 from "@/public/infinit_scroll/pngwing.com (1).png"
import logo4 from "@/public/infinit_scroll/pngwing.com.png"
import logo5 from "@/public/infinit_scroll/university-of-surrey-logo-png-transparent.png"

const logos: Array<{ id: number; name: string; image: StaticImageData }> = [
  { id: 1, name: "Hult", image: logo1 },
  { id: 2, name: "GSDM", image: logo2 },
  { id: 3, name: "Uni Logo 3", image: logo3 },
  { id: 4, name: "Uni Logo 4", image: logo4 },
  { id: 5, name: "Surrey", image: logo5 },
]

const LogoCard = ({ image, name }: { image: StaticImageData; name: string }) => (
  <figure
    className={cn(
      "relative flex h-28 w-44 items-center justify-center overflow-hidden rounded-xl bg-white/5 px-4 py-3 backdrop-blur"
    )}
  >
    <Image
      src={image}
      alt={name}
      className="h-16 w-auto object-contain grayscale opacity-80"
      sizes="(max-width: 640px) 140px, 176px"
    />
  </figure>
)

export function MarqueeDemo() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {logos.map((logo) => (
          <LogoCard key={logo.id} image={logo.image} name={logo.name} />
        ))}
      </Marquee>
      <div className="from-[--color-bg-primary] pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"></div>
      <div className="from-[--color-bg-primary] pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>

    </div>
  )
}
