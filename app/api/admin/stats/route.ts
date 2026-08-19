import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const totalRevenue = db.prepare('SELECT SUM(total_amount) as total FROM orders WHERE payment_status = "Paid"').get() as any;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "customer"').get() as any;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const lowStockProducts = db.prepare('SELECT * FROM products WHERE stock < 20').all();
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all();

    return NextResponse.json({
      stats: {
        revenue: totalRevenue?.total || 0,
        orders: totalOrders?.count || 0,
        users: totalUsers?.count || 0,
        products: totalProducts?.count || 0,
      },
      lowStockProducts,
      recentOrders
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
