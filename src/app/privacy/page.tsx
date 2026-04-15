export default function PrivacyPage() {
  return (
    <main className="container-page py-20 space-y-6 text-slate-300">

      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>

      <p>
        We respect your privacy and are committed to protecting your data.
      </p>

      <h2 className="text-xl text-white">1. Information We Collect</h2>
      <ul className="list-disc ml-6">
        <li>Email address</li>
        <li>Purchase history</li>
        <li>Support messages</li>
      </ul>

      <h2 className="text-xl text-white">2. How We Use Data</h2>
      <ul className="list-disc ml-6">
        <li>Provide product access</li>
        <li>Customer support</li>
        <li>Improve services</li>
      </ul>

      <h2 className="text-xl text-white">3. Data Security</h2>
      <p>
        We use secure Firebase and encrypted systems.
      </p>

      <h2 className="text-xl text-white">4. Third Parties</h2>
      <p>
        Payments handled via Razorpay. We do not store card details.
      </p>

      <h2 className="text-xl text-white">5. Contact</h2>
      <p>Email: support@yourdomain.com</p>

    </main>
  );
}