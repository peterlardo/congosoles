import type { Store } from "@/lib/data"

interface StoreLogoProps {
  store: Store
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-base",
  lg: "h-20 w-20 text-xl",
  xl: "h-28 w-28 text-3xl",
}

export function StoreLogo({ store, size = "md" }: StoreLogoProps) {
  return (
    <div
      className={`${store.logoGradient} ${sizeClasses[size]} flex flex-col items-center justify-center rounded-2xl shadow-lg ring-2 ring-white/20`}
    >
      <span className={`font-display font-black ${store.logoColor} leading-none tracking-tight`}>
        {store.logoInitial}
      </span>
      <span className="mt-0.5 text-[0.6em] opacity-80">{store.category}</span>
    </div>
  )
}
