import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const lower = (message || '').toLowerCase();

    let reply = "I'm Zyvra's AI Assistant! How can I help you with our products, orders, or checkout today?";

    if (lower.includes('shipping') || lower.includes('deliver') || lower.includes('time')) {
      reply = "We offer fast worldwide shipping! Standard delivery takes 3-5 business days. Orders over $100 qualify for FREE shipping!";
    } else if (lower.includes('return') || lower.includes('refund')) {
      reply = "Zyvra has a 30-day hassle-free return policy on all unworn items and undamaged gadgets in original packaging.";
    } else if (lower.includes('discount') || lower.includes('coupon') || lower.includes('promo')) {
      reply = "You can use coupon code 'ZYVRA20' for 20% off orders over $50, or 'WELCOME10' for $10 off!";
    } else if (lower.includes('payment') || lower.includes('pay') || lower.includes('cod')) {
      reply = "We accept secure online payments (Credit/Debit Card, UPI, NetBanking via Stripe/Razorpay simulation) as well as Cash on Delivery (COD).";
    } else if (lower.includes('admin') || lower.includes('credentials')) {
      reply = "Admin login is available at /admin with username admin@zyvra.com and password admin123.";
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
