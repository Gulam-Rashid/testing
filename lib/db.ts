import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'zyvra.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    image TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    compare_price REAL,
    category_id INTEGER,
    image TEXT,
    images TEXT, -- JSON array of images
    stock INTEGER DEFAULT 50,
    rating REAL DEFAULT 4.5,
    reviews_count INTEGER DEFAULT 12,
    is_featured BOOLEAN DEFAULT 0,
    is_trending BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    session_id TEXT,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT UNIQUE NOT NULL,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    discount_amount REAL DEFAULT 0,
    shipping_fee REAL DEFAULT 0,
    payment_method TEXT NOT NULL,
    payment_status TEXT DEFAULT 'Paid',
    order_status TEXT DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    product_name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_percent REAL,
    discount_amount REAL,
    min_spend REAL DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    expires_at TEXT
  );

  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT NOT NULL,
    link TEXT,
    is_active BOOLEAN DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    user_name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

// Seed initial data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password, role, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Admin Zyvra', 'admin@zyvra.com', hashedPassword, 'admin', '+1 555-0199', '101 Tech Avenue, Silicon Valley, CA');

  const hashedUserPassword = bcrypt.hashSync('user123', 10);
  db.prepare(`
    INSERT INTO users (name, email, password, role, phone, address)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run('Alex Johnson', 'user@zyvra.com', hashedUserPassword, 'customer', '+1 555-0142', '452 Market Street, San Francisco, CA');

  // Categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', description: 'Cutting-edge gadgets and audio devices' },
    { name: 'Fashion & Apparel', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80', description: 'Trendsetting styles for modern wardrobes' },
    { name: 'Home & Living', slug: 'home-living', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=500&q=80', description: 'Elevate your living space with smart decor' },
    { name: 'Fitness & Health', slug: 'fitness', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80', description: 'Gear to achieve your peak performance' },
    { name: 'Beauty & Skincare', slug: 'beauty', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80', description: 'Premium organic skincare & cosmetics' },
  ];

  const insertCategory = db.prepare('INSERT INTO categories (name, slug, image, description) VALUES (?, ?, ?, ?)');
  categories.forEach(c => insertCategory.run(c.name, c.slug, c.image, c.description));

  // Products
  const products = [
    {
      name: 'Zyvra Apex Pro Wireless ANC Headphones',
      slug: 'zyvra-apex-pro-headphones',
      description: 'Immerse in studio-grade acoustics with hybrid active noise cancellation, 40-hour battery life, and ultra-soft protein leather ear cushions.',
      price: 299.99,
      compare_price: 349.99,
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=700&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80'
      ]),
      stock: 45,
      rating: 4.9,
      reviews_count: 128,
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Zyvra Horizon Ultra Smartwatch',
      slug: 'zyvra-horizon-ultra-smartwatch',
      description: 'Aerospace-grade titanium chassis, vibrant AMOLED always-on display, comprehensive ECG, SpO2, and multi-sport GPS tracking.',
      price: 199.99,
      compare_price: 249.99,
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700&q=80'
      ]),
      stock: 30,
      rating: 4.8,
      reviews_count: 94,
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Minimalist Artisan Ceramic Coffee Set',
      slug: 'minimalist-artisan-ceramic-coffee-set',
      description: 'Handcrafted stoneware pour-over dripper and matching mugs designed for coffee aficionados who appreciate aesthetic morning rituals.',
      price: 68.50,
      compare_price: 85.00,
      category_id: 3,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&q=80',
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=700&q=80'
      ]),
      stock: 60,
      rating: 4.7,
      reviews_count: 52,
      is_featured: 1,
      is_trending: 0
    },
    {
      name: 'Zyvra Lumina Ergonomic Executive Chair',
      slug: 'zyvra-lumina-ergonomic-chair',
      description: 'Engineered for 10+ hour work sessions with dynamic lumbar support, 4D adjustable armrests, and breathable mesh upholstery.',
      price: 450.00,
      compare_price: 520.00,
      category_id: 3,
      image: 'https://images.unsplash.com/photo-1580481077494-e3299acae55c?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580481077494-e3299acae55c?w=700&q=80'
      ]),
      stock: 15,
      rating: 4.9,
      reviews_count: 76,
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Eco-Flex Performance Training Hoodie',
      slug: 'eco-flex-performance-training-hoodie',
      description: 'Crafted from recycled bamboo-cotton blend with moisture-wicking technology and hidden zippered security pocket.',
      price: 79.99,
      compare_price: 95.00,
      category_id: 2,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=700&q=80'
      ]),
      stock: 100,
      rating: 4.6,
      reviews_count: 41,
      is_featured: 0,
      is_trending: 1
    },
    {
      name: 'Zyvra Pulse Carbon Running Shoes',
      slug: 'zyvra-pulse-carbon-running-shoes',
      description: 'Ultra-responsive nitrogen-infused foam midsole paired with carbon fiber plate for explosive forward propulsion on race day.',
      price: 180.00,
      compare_price: 210.00,
      category_id: 4,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=80'
      ]),
      stock: 40,
      rating: 4.8,
      reviews_count: 110,
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Botanical Radiance Vitamin C Serum',
      slug: 'botanical-radiance-vitamin-c-serum',
      description: 'Concentrated 20% L-Ascorbic Acid formula with hyaluronic acid and Kakadu plum for instant luminosity and anti-aging defense.',
      price: 54.00,
      compare_price: 65.00,
      category_id: 5,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=700&q=80'
      ]),
      stock: 85,
      rating: 4.9,
      reviews_count: 184,
      is_featured: 1,
      is_trending: 1
    },
    {
      name: 'Zyvra Quantum 4K Gaming Monitor',
      slug: 'zyvra-quantum-4k-gaming-monitor',
      description: '27-inch IPS 144Hz 1ms response time with HDR600, NVIDIA G-SYNC compatibility, and ultra-slim bezels for immersive gaming.',
      price: 499.99,
      compare_price: 599.99,
      category_id: 1,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&q=80',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=700&q=80'
      ]),
      stock: 12,
      rating: 4.7,
      reviews_count: 38,
      is_featured: 0,
      is_trending: 0
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (name, slug, description, price, compare_price, category_id, image, images, stock, rating, reviews_count, is_featured, is_trending)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  products.forEach(p => {
    insertProduct.run(
      p.name, p.slug, p.description, p.price, p.compare_price, p.category_id, p.image, p.images, p.stock, p.rating, p.reviews_count, p.is_featured, p.is_trending
    );
  });

  // Coupons
  db.prepare(`
    INSERT INTO coupons (code, discount_percent, min_spend, is_active, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run('ZYVRA20', 20, 50, 1, '2026-12-31');

  db.prepare(`
    INSERT INTO coupons (code, discount_amount, min_spend, is_active, expires_at)
    VALUES (?, ?, ?, ?, ?)
  `).run('WELCOME10', 10, 30, 1, '2026-12-31');

  // Banners
  db.prepare(`
    INSERT INTO banners (title, subtitle, image, link, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run('Spring Tech & Living Festival', 'Upgrade your lifestyle with up to 40% off premium gadgets & decor.', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80', '/products', 1);

  db.prepare(`
    INSERT INTO banners (title, subtitle, image, link, is_active)
    VALUES (?, ?, ?, ?, ?)
  `).run('Apex Pro Sound Revolution', 'Experience pristine acoustic clarity. Free shipping worldwide.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&q=80', '/products/zyvra-apex-pro-headphones', 1);

  // Initial Order for demo
  const res = db.prepare(`
    INSERT INTO orders (order_number, user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, discount_amount, shipping_fee, payment_method, payment_status, order_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run('ZYV-98421', 2, 'Alex Johnson', 'user@zyvra.com', '+1 555-0142', '452 Market Street, San Francisco, CA', 349.98, 0, 0, 'Online Payment', 'Paid', 'Shipped');

  const orderId = res.lastInsertRowid;
  db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(orderId, 1, 'Zyvra Apex Pro Wireless ANC Headphones', 299.99, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80');
  
  db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(orderId, 3, 'Minimalist Artisan Ceramic Coffee Set', 49.99, 1, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=700&q=80');
}

export default db;
