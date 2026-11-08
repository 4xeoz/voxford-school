import Image from "next/image";

export default function BrandLockup({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return <span dir="ltr" className={`inline-flex items-center ${compact ? "gap-2" : "gap-3"}`} aria-label="Voxbridge Language School">
    <Image src={light ? "/voxbridge/icon-detailed-white-transparent-v2.png" : "/voxbridge/icon-detailed-red-transparent-v2.png"} alt="" aria-hidden width={compact ? 43 : 72} height={compact ? 43 : 72} className={compact ? "h-10 w-10 shrink-0 object-contain" : "h-[70px] w-[70px] shrink-0 object-contain"} />
    <span className={`flex flex-col font-black leading-[.98] tracking-[-.035em] ${light ? "text-white" : "text-[#c50902]"} ${compact ? "text-[12px] sm:text-[14px]" : "text-[21px] sm:text-[24px]"}`}>
      <span>Voxbridge</span><span>Language</span><span>School.</span>
    </span>
  </span>;
}
