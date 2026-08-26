import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site";

type LogoProps = {
  variant?: "default" | "footer";
  className?: string;
};

export function Logo({ variant = "default", className = "" }: LogoProps) {
  const sizeClass =
    "h-11 w-auto max-w-[min(100%,280px)] sm:h-12 sm:max-w-[320px] md:h-14 md:max-w-[360px]";

  return (
    <Link
      href="/"
      className={`inline-flex shrink-0 items-center transition hover:opacity-90 ${className}`}
      aria-label={siteConfig.name}
    >
      <Image
        src={siteConfig.logoSrc}
        alt={siteConfig.name}
        width={849}
        height={273}
        priority={variant === "default"}
        className={`${sizeClass}${variant === "footer" ? " brightness-0 invert" : ""}`}
      />
    </Link>
  );
}
