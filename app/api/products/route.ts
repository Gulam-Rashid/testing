import { NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'zyvra_secret_key_998877';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const trending = searchParams.get('trending');
    const limit = searchParams.get('limit');

    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (featured === 'true') {
      query += ` AND p.is_featured = 1`;
    }

    if (trending === 'true') {
      query += ` AND p.is_trending = 1`;
    }

    query += ` ORDER BY p.created_at DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit));
    }

    const products = db.prepare(query).all(...params);
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('zyvra_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, price, compare_price, category_id, image, images, stock, is_featured, is_trending } = body;

    if (!name || !price || !category_id) {
      return NextResponse.json({ error: 'Name, price, and category are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const result = db.prepare(`
      INSERT INTO products (name, slug, description, price, compare_price, category_id, image, images, stock, is_featured, is_trending)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name, slug, description || '', price, compare_price || null, category_id, 
      image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
      images ? JSON.stringify(images) : JSON.stringify([image]),
      stock || 50, is_featured ? 1 : 0, is_trending ? 1 : 0
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
