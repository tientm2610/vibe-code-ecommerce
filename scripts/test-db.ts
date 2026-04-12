import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

main();