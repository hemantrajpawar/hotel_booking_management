const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Generate Invoice & Email It
const generateInvoiceAndSend = async (userData, type = "booking") => {
  const { customerName, roomType, amount, email } = userData;

  // 🧾 Generate invoice number
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 💸 Tax Calculation (18% GST)
  const GSTtaxRate = 0.18;
  const servicetax = 0.07 ; 
  const taxAmount = (amount * GSTtaxRate) + (amount*servicetax );
  const totalWithTax = amount + taxAmount;

  const fileName = `${type}-invoice-${Date.now()}.pdf`;
  const invoicePath = path.join(__dirname, "../invoices", fileName);

  fs.mkdirSync(path.join(__dirname, "../invoices"), { recursive: true });

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // Invoice Content
    doc.fontSize(20).text("Hotel Booking Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice No: ${invoiceNumber}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(14).text(`Customer Name: ${customerName}`);
    doc.text(`Room Type: ${roomType}`);
    doc.text(`Base Amount: ₹${amount.toFixed(2)}`);
    doc.text(`GST (18%): ₹${(amount * GSTtaxRate).toFixed(2)}`);
    doc.text(`Service Tax (7%): ₹${(amount*servicetax ).toFixed(2)}`);
    doc.text(`Total Amount (incl. tax): ₹${totalWithTax.toFixed(2)}`);

    if (type === "cancellation") {
      doc.moveDown();
      doc.fillColor("red").fontSize(16).text(" This booking was cancelled.");
    }

    doc.end();

    writeStream.on("finish", async () => {
      try {
        await sendEmailWithInvoice(email, invoicePath, type, customerName, roomType, totalWithTax, invoiceNumber);
        resolve("Email sent.");
      } catch (err) {
        reject("Email error: " + err);
      }
    });

    writeStream.on("error", (err) => reject("PDF error: " + err));
  });
};



// Email Function
const sendEmailWithInvoice = async (recipientEmail, attachmentPath, type, name, room, amount, invoiceNumber) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: "rwveqnwehkqtrlet",
    },
  });

  const subject =
    type === "cancellation"
      ? `Your Booking Cancellation Invoice - ${invoiceNumber}`
      : `Your Hotel Booking Invoice - ${invoiceNumber}`;

  const text =
    type === "cancellation"
      ? `Dear ${name},\n\nYour booking has been cancelled.\n\nRoom: ${room}\nTotal Refunded: ₹${amount.toFixed(2)}\nInvoice No: ${invoiceNumber}\nDate: ${new Date().toLocaleDateString()}\n\nRegards,\nHotel Team`
      : `Dear ${name},\n\nThank you for your booking.\n\nRoom: ${room}\nTotal Paid: ₹${amount.toFixed(2)}\nInvoice No: ${invoiceNumber}\nDate: ${new Date().toLocaleDateString()}\n\nWe look forward to your stay!\n\nHotel Team`;

  const mailOptions = {
    from: process.env.EMAIL_ID,
    to: recipientEmail,
    subject,
    text,
    attachments: [{ filename: "Invoice.pdf", path: attachmentPath }],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("Email failed:", err);
    else console.log("Email sent:", info.response);
  });
};


module.exports={generateInvoiceAndSend,sendEmailWithInvoice};
