const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const BCRYPT_ROUNDS = 10;

const categories = [
  { name: 'Electronics', description: 'Electronic devices and gadgets' },
  { name: 'Accessories', description: 'Computer and phone accessories' },
  { name: 'Audio', description: 'Headphones, speakers, and audio equipment' },
  { name: 'Storage', description: 'External drives and storage solutions' },
];

const products = [
  { name: 'Wireless Headphones', description: 'Premium noise-cancelling wireless headphones', price: 199.99, stock: 50, categoryIndex: 0 },
  { name: 'Smart Watch Pro', description: 'Advanced fitness tracking smartwatch', price: 349.99, stock: 30, categoryIndex: 0 },
  { name: 'Bluetooth Speaker', description: 'Portable waterproof Bluetooth speaker', price: 79.99, stock: 100, categoryIndex: 2 },
  { name: 'USB-C Hub 7-in-1', description: 'Multi-port USB-C hub for laptops', price: 49.99, stock: 75, categoryIndex: 1 },
  { name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard with Cherry switches', price: 149.99, stock: 40, categoryIndex: 1 },
  { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', price: 39.99, stock: 80, categoryIndex: 1 },
  { name: 'Webcam 4K', description: 'Ultra HD webcam for video calls', price: 129.99, stock: 25, categoryIndex: 0 },
  { name: 'Laptop Stand', description: 'Adjustable aluminum laptop stand', price: 59.99, stock: 60, categoryIndex: 1 },
  { name: 'Portable SSD 1TB', description: 'High-speed portable SSD', price: 119.99, stock: 45, categoryIndex: 3 },
  { name: 'Portable SSD 2TB', description: 'High-capacity portable SSD', price: 199.99, stock: 20, categoryIndex: 3 },
  { name: 'USB Flash Drive 128GB', description: 'High-speed USB 3.1 flash drive', price: 29.99, stock: 200, categoryIndex: 3 },
  { name: 'Wireless Charger', description: 'Fast wireless charging pad', price: 34.99, stock: 150, categoryIndex: 1 },
  { name: 'Phone Case Premium', description: 'Protective phone case', price: 24.99, stock: 300, categoryIndex: 1 },
  { name: 'Screen Protector', description: 'Tempered glass screen protector', price: 14.99, stock: 500, categoryIndex: 1 },
  { name: 'Audio Interface', description: 'Professional audio interface', price: 89.99, stock: 35, categoryIndex: 2 },
  { name: 'Studio Monitor', description: 'Compact studio monitors', price: 179.99, stock: 20, categoryIndex: 2 },
  { name: 'Gaming Headset', description: 'Surround sound gaming headset', price: 89.99, stock: 55, categoryIndex: 2 },
  { name: 'Tablet Stand', description: 'Adjustable tablet stand', price: 29.99, stock: 90, categoryIndex: 1 },
  { name: 'Smart Display', description: '10-inch smart display', price: 149.99, stock: 25, categoryIndex: 0 },
  { name: 'Action Camera', description: '4K action camera with accessories', price: 249.99, stock: 15, categoryIndex: 0 },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', BCRYPT_ROUNDS);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password_hash: adminPassword,
      full_name: 'System Administrator',
      role: 'ADMIN',
    },
  });
  console.log(`   Created admin: ${admin.email}`);

  // Create regular users
  console.log('👥 Creating regular users...');
  const userPassword = await bcrypt.hash('user123', BCRYPT_ROUNDS);

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password_hash: userPassword,
      full_name: 'John Doe',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      password_hash: userPassword,
      full_name: 'Jane Smith',
      role: 'USER',
    },
  });
  console.log(`   Created users: ${user1.email}, ${user2.email}`);

  // Create categories
  console.log('📁 Creating categories...');
  const createdCategories = await Promise.all(
    categories.map((cat) =>
      prisma.category.create({ data: cat })
    )
  );
  console.log(`   Created ${createdCategories.length} categories`);

  // Create products
  console.log('📦 Creating products...');
  const skuBase = 1000;
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const category = createdCategories[p.categoryIndex];
    await prisma.product.create({
      data: {
        name: p.name,
        description: p.description,
        sku: `SKU-${skuBase + i}`,
        price: p.price,
        stock: p.stock,
        category_id: category.id,
      },
    });
  }
  console.log(`   Created ${products.length} products`);

  console.log('✅ Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@ecommerce.com / admin123');
  console.log('   User:  john@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });