import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendPurchaseEmail({
  email,
  productName,
  price,
  invoiceBuffer
}: {
  email: string;
  productName: string;
  price: number;
  invoiceBuffer: Buffer;
}) {
  try {
    const response = await resend.emails.send({
      from: "DevAstra <onboarding@resend.dev>",
      to: email,
      subject: "🎉 Purchase Successful + Invoice",

      html: `
        <div style="font-family:sans-serif">
          <h2>Payment Successful 🎉</h2>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Amount Paid:</strong> ₹${price}</p>
          <p>Your invoice is attached below.</p>
        </div>
      `,

      attachments: [
        {
          filename: "invoice.pdf",
          content: invoiceBuffer
        }
      ]
    });

    console.log("✅ Email sent:", response);

  } catch (err) {
    console.error("❌ Email failed:", err);
  }
}