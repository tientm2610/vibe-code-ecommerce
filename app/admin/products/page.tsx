'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { productService, Product, ProductFilters } from '@/lib/services/product.service';
import { categoryService, Category } from '@/lib/services/category.service';
import { productCardApi } from '@/lib/services/product.service';
import { categoryApi } from '@/lib/services/category.service';
import { ProductGrid } from '@/components/product-grid';
import { ProductSkeleton } from '@/components/product-skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 20 });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', sku: '', price: 0, stock: 0, categoryId: '', imageUrl: ''
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-products', filters],
    queryFn: () => productCardApi.getProducts(filters),
  });

  const createMutation = useMutation({
    mutationFn: productCardApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', sku: '', price: 0, stock: 0, categoryId: '', imageUrl: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productCardApi.deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
  });

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(formData as any); }} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({...formData, price: +e.target.value})} required />
                </div>
                <div>
                  <Label>Stock</Label>
                  <Input type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: +e.target.value})} required />
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} />
              </div>
              <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <ProductSkeleton count={8} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive mb-4">Failed to load products</p>
              <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-products'] })}>Retry</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">SKU</th>
                      <th className="text-left py-3 px-4">Price</th>
                      <th className="text-left py-3 px-4">Stock</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.categoryName}</div>
                        </td>
                        <td className="py-3 px-4">{product.sku}</td>
                        <td className="py-3 px-4">${Number(product.price).toFixed(2)}</td>
                        <td className="py-3 px-4">{product.stock}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(product.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button key={page} variant={page === pagination.page ? 'default' : 'outline'} size="sm"
                      onClick={() => setFilters({ ...filters, page })}>{page}</Button>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}