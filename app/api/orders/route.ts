import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let orders;
    if (decoded.role === 'admin' && all === 'true') {
      orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    } else {
      orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(decoded.id);
    }

    // Attach items for each order
    const ordersWithItems = orders.map((order: any) => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...(order as object), items };
    });

    return NextResponse.json({ orders: ordersWithItems });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return NextResponse.json({ error: 'Please login to checkout' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.id;

    const body = await req.json();
    const { customer_name, customer_email, customer_phone, shipping_address, payment_method, coupon_code } = body;

    if (!customer_name || !customer_email || !shipping_address || !payment_method) {
      return NextResponse.json({ error: 'Missing required shipping or payment details' }, { status: 400 });
    }

    // Get user cart items
    const cartItems = db.prepare(`
      SELECT ci.quantity, p.id as product_id, p.name, p.price, p.image, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId) as any[];

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty' }, { status: 400 });
    }

    let subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    let discount = 0;

    if (coupon_code) {
      const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(coupon_code) as any;
      if (coupon && subtotal >= coupon.min_spend) {
        if (coupon.discount_percent) {
          discount = (subtotal * coupon.discount_percent) / 100;
        } else if (coupon.discount_amount) {
          discount = coupon.discount_amount;
        }
      }
    }

    const shipping_fee = subtotal > 100 ? 0 : 15;
    const total_amount = Math.max(0, subtotal - discount + shipping_fee);
    const order_number = 'ZYV-' + Math.floor(10000 + Math.random() * 90000);

    const result = db.prepare(`
      INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, discount_amount, shipping_fee, payment_method, payment_status, order_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      order_number, userId, customer_name, customer_email, customer_phone || '', shipping_address,
      total_amount, discount, shipping_fee, payment_method, 'Paid', 'Pending'
    );

    const orderId = result.lastInsertRowid;

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');

    for (const item of cartItems) {
      insertItem.run(orderId, item.product_id, item.name, item.price, item.quantity, item.image);
      updateStock.run(item.quantity, item.product_id);
    }

    // Clear cart
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as any;
    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    return NextResponse.json({ success: true, order: { ...(order as object), items } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
