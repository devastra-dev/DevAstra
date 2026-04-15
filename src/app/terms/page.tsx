export default function TermsPage() {
  return (
    <main className="container-page py-20 space-y-6 text-slate-300">

      <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>

      <p>
        By accessing DevAstra, you agree to be bound by these terms.
      </p>

      <h2 className="text-xl text-white">1. Digital Products</h2>
      <p>
        All products are digital and delivered electronically.
      </p>

      <h2 className="text-xl text-white">2. License</h2>
      <p>
        You are granted a non-exclusive, non-transferable license for personal or commercial use.
      </p>

      <h2 className="text-xl text-white">3. Restrictions</h2>
      <ul className="list-disc ml-6">
        <li>No reselling</li>
        <li>No redistribution</li>
        <li>No sharing download links</li>
      </ul>

      <h2 className="text-xl text-white">4. Payments</h2>
      <p>
        All payments are processed securely via Razorpay.
      </p>

      <h2 className="text-xl text-white">5. Termination</h2>
      <p>
        We reserve the right to terminate access if misuse is detected.
      </p>

      <h2 className="text-xl text-white">6. Changes</h2>
      <p>
        Terms may be updated at any time without notice.
      </p>

    </main>
  );
}