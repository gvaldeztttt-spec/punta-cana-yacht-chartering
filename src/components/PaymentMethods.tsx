import Image from "next/image";
import { PAYMENT_LOGOS } from "@/lib/payment-methods";

export function PaymentMethods() {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {PAYMENT_LOGOS.map((logo) => (
        <div
          key={logo.id}
          className="flex h-12 min-w-[88px] items-center justify-center rounded-xl border border-sky/50 bg-white px-4 py-2 shadow-sm"
        >
          <Image
            src={logo.src}
            alt={logo.name}
            width={logo.width}
            height={logo.height}
            className="h-7 w-auto max-w-[88px] object-contain"
          />
        </div>
      ))}
    </div>
  );
}
