import Link from "next/link";
import { SignatureMark } from "@/components/ui/SignatureMark";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-[600px] flex-col items-center justify-center px-4 py-24 text-center">
      <SignatureMark size={30} />
      <p className="eyebrow mt-6 text-charcoal">404</p>
      <h1 className="mt-2 font-display text-3xl">This page doesn&rsquo;t exist after all</h1>
      <Link href="/" className="eyebrow mt-8 underline underline-offset-4">
        Back to Home
      </Link>
    </div>
  );
}
