import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

async function getUserId(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ items: [] });
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.compare_price, p.image, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId);

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Please login to add items to cart' }, { status: 401 });
    }

    const { product_id, quantity = 1 } = await req.json();
    if (!product_id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const existing = db.prepare('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, product_id) as any;

    if (existing) {
      const newQty = existing.quantity + quantity;
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
    } else {
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(userId, product_id, quantity);
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.compare_price, p.image, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId);

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { cart_item_id, quantity } = await req.json();
    if (quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(cart_item_id, userId);
    } else {
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?').run(quantity, cart_item_id, userId);
    }

    const items = db.prepare(`
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.compare_price, p.image, p.stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `).all(userId);

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const cart_item_id = searchParams.get('id');

    if (cart_item_id) {
      db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(cart_item_id, userId);
    } else {
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);
    }

    return NextResponse.json({ success: true, items: [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
