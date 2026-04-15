import PDFDocument from "pdfkit";
import path from "path";

export async function generateInvoice({
  email,
  productName,
  amount,
  orderId
}: {
  email: string;
  productName: string;
  amount: number;
  orderId: string;
}): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // 🔥 FONT PATH
      const fontPath = path.join(
        process.cwd(),
        "public/fonts/Roboto-BlackItalic.ttf"
      );

      // 🔥 FIX: font constructor-এ দাও (IMPORTANT)
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        font: fontPath
      });

      const buffers: Uint8Array[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // ======================
      // 🔥 HEADER
      // ======================
      doc
        .fontSize(22)
        .text("DevAstra", { align: "center" });

      doc
        .fontSize(14)
        .text("Premium Developer Products", { align: "center" });

      doc.moveDown(2);

      doc
        .fontSize(18)
        .text("INVOICE", { align: "center" });

      doc.moveDown();

      // ======================
      // 🔥 ORDER INFO
      // ======================
      doc.fontSize(12);

      doc.text(`Order ID: ${orderId}`);
      doc.text(`Customer Email: ${email}`);
      doc.text(`Product: ${productName}`);

      doc.moveDown();

      // ======================
      // 💰 PRICE
      // ======================
      doc
        .fontSize(14)
        .text(`Total Paid: ₹${amount}`, {
          align: "left"
        });

      doc.moveDown();

      // ======================
      // ✅ STATUS
      // ======================
      doc
        .fillColor("green")
        .text("Status: PAID");

      doc.fillColor("black");

      doc.moveDown(2);

      // ======================
      // 🙏 FOOTER
      // ======================
      doc
        .fontSize(11)
        .text("Thank you for your purchase!", {
          align: "center"
        });

      doc.text("devastra.store", {
        align: "center"
      });

      doc.end();

    } catch (err) {
      reject(err);
    }
  });
}