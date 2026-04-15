import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/lib/firebase-admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 EMAIL VALIDATION
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 🔥 RATE LIMIT (IP आधारित)
const rateLimitMap = new Map<string, number>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const last = rateLimitMap.get(ip) || 0;

  if (now - last < 10000) {
    return true;
  }

  rateLimitMap.set(ip, now);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // =========================
    // 🔥 IP DETECTION (SAFE)
    // =========================
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // =========================
    // 🔥 RATE LIMIT
    // =========================
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    const email = body.email?.trim().toLowerCase();
    const message = body.message?.trim();

    // =========================
    // 🔥 BOT PROTECTION (HIDDEN FIELD)
    // =========================
    if (body.botField) {
      return NextResponse.json(
        { error: "Bot detected" },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 VALIDATION
    // =========================
    if (!email || !message) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message too short" },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 FIREBASE INIT
    // =========================
    const db = getAdminApp().firestore();

    // =========================
    // 🔥 SAVE TICKET (HARDENED)
    // =========================
    const docRef = await db.collection("support_tickets").add({
      email,
      message,
      status: "open",

      // 🔥 FUTURE READY
      priority: "normal",
      replies: [],
      lastReplyAt: null,

      // 🔐 META (tracking)
      ip,
      userAgent: req.headers.get("user-agent") || "unknown",

      createdAt: new Date()
    });

    console.log("📩 Support ticket saved:", docRef.id);

    // =========================
    // 🔥 ADMIN EMAIL (SAFE)
    // =========================
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "DevAstra Support <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL || "devastra093@gmail.com",
          subject: `📩 New Support Ticket (${docRef.id})`,
          html: `
            <h2>New Support Ticket</h2>
            <p><b>ID:</b> ${docRef.id}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b></p>
            <p>${message}</p>
          `
        });
      }
    } catch (e) {
      console.warn("⚠️ Admin email failed:", e);
    }

    // =========================
    // 🔥 USER AUTO REPLY
    // =========================
    try {
      if (process.env.RESEND_API_KEY) {
        await resend.emails.send({
          from: "DevAstra <onboarding@resend.dev>",
          to: email,
          subject: "We received your request ✅",
          html: `
            <h2>Support Ticket Received 🎟️</h2>
            <p>Hi,</p>
            <p>We’ve received your request. Our team will respond shortly.</p>

            <p><b>Ticket ID:</b> ${docRef.id}</p>

            <hr/>

            <p><b>Your message:</b></p>
            <p>${message}</p>

            <br/>
            <p>— DevAstra Team</p>
          `
        });
      }
    } catch (e) {
      console.warn("⚠️ User email failed:", e);
    }

    // =========================
    // 🚀 RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      ticketId: docRef.id
    });

  } catch (err) {
    console.error("❌ SUPPORT API ERROR:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}