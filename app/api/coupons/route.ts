import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

export async function GET() {
  try {
    const coupons = db.prepare('SELECT * FROM coupons').all();
    return NextResponse.json({ coupons });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { code, cart_subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code) as any;
    if (!coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 404 });
    }

    if (cart_subtotal && cart_subtotal < coupon.min_spend) {
      return NextResponse.json({ error: `Minimum spend of $${coupon.min_spend} required for this coupon` }, { status: 400 });
    }

    let discount = 0;
    if (coupon.discount_percent) {
      discount = (cart_subtotal * coupon.discount_percent) / 100;
    } else if (coupon.discount_amount) {
      discount = coupon.discount_amount;
    }

    return NextResponse.json({ success: true, coupon, discount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
