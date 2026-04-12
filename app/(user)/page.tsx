import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to ShopHub</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your one-stop shop for all products
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Browse Products
          </Link>
          <Link href="/register" className="px-6 py-3 border border-input rounded-md hover:bg-slate-50">
            Create Account
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-muted-foreground">Browse thousands of products across various categories</p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
          <p className="text-muted-foreground">Safe and secure checkout process</p>
        </div>
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-muted-foreground">Quick and reliable shipping to your door</p>
        </div>
      </section>
    </div>
  );
}