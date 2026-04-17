export default function RefundPage() {
  return (
    <main className="container-page py-20 space-y-6 text-slate-300">

      <h1 className="text-3xl font-bold text-white">Refund Policy</h1>

      <p>
        Due to the nature of digital products, all sales are final.
      </p>

      <h2 className="text-xl text-white">No Refund</h2>
      <p>
        Once a product is downloaded or accessed, we do not offer refunds.
      </p>

      <h2 className="text-xl text-white">Exceptions</h2>
      <p>
        Refunds may be considered only if:
      </p>

      <ul className="list-disc ml-6">
        <li>Product is not delivered</li>
        <li>Payment deducted but access not given</li>
      </ul>

      <h2 className="text-xl text-white">Contact</h2>
      <p>
        For refund requests, contact support within 24 hours.
      </p>

    </main>
  );
}