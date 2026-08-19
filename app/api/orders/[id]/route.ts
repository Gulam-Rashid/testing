import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = db.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?').get(id, id) as any;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
    return NextResponse.json({ order: { ...(order as object), items } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const { order_status, payment_status } = await req.json();

    if (order_status) {
      db.prepare('UPDATE orders SET order_status = ? WHERE id = ?').run(order_status, id);
    }
    if (payment_status) {
      db.prepare('UPDATE orders SET payment_status = ? WHERE id = ?').run(payment_status, id);
    }

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as any;
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);

    return NextResponse.json({ success: true, order: { ...(updated as object), items } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
