import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ paid: false, error: "Stripe is not configured" }, { status: 500 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ paid: false, error: "No session ID" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return NextResponse.json({
        paid: true,
        customerEmail: session.customer_details?.email,
        submissionType: session.metadata?.submissionType,
        mode: session.metadata?.mode,
      });
    }

    return NextResponse.json({ paid: false });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ paid: false, error: err.message }, { status: 500 });
  }
}
