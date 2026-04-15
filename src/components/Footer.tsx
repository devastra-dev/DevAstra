import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20 py-6 text-center text-sm text-slate-400">

      <div className="space-x-4">
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/refund">Refund</Link>
        <Link href="/support">Support</Link>
      </div>

      <p className="mt-3">© 2026 DevAstra</p>
    </footer>
  );
}