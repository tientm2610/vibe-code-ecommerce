import { productRepository } from '../repositories/product.repository';
import { categoryRepository } from '../repositories/category.repository';
import { orderRepository, OrderWithItems, OrderWithItemsAndUser } from '../repositories/order.repository';
import { userRepository } from '../repositories/user.repository';
import AppError from '../utils/app-error';
import { OrderStatus, UserRole } from '@prisma/client';

export interface CreateProductDto {
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  sku?: string;
  price?: number;
  stock?: number;
  imageUrl?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  sku: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: string;
  isActive?: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface UpdateUserDto {
  fullName?: string;
  isActive?: boolean;
  role?: UserRole;
}

export class AdminService {
  async getProducts(page = 1, limit = 20, filters?: { categoryId?: string; isActive?: boolean; search?: string }) {
    const { products, total } = await productRepository.findAll(page, limit, filters);
    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      sku: p.sku,
      price: Number(p.price),
      stock: p.stock,
      imageUrl: p.image_url,
      isActive: p.is_active,
      categoryId: p.category_id,
      categoryName: p.category.name,
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));
    return {
      products: formatted,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: Number(product.price),
      stock: product.stock,
      imageUrl: product.image_url,
      isActive: product.is_active,
      categoryId: product.category_id,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await productRepository.findBySku(dto.sku);
    if (existing) throw new AppError('SKU already exists', 409, 'SKU_EXISTS');
    const product = await productRepository.create({
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      price: dto.price,
      stock: dto.stock,
      image_url: dto.imageUrl,
      category_id: dto.categoryId
    });
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: Number(product.price),
      stock: product.stock,
      imageUrl: product.image_url,
      isActive: product.is_active,
      categoryId: product.category_id,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    if (dto.sku && dto.sku !== product.sku) {
      const existing = await productRepository.findBySku(dto.sku);
      if (existing) throw new AppError('SKU already exists', 409, 'SKU_EXISTS');
    }
    const updated = await productRepository.update(id, {
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      price: dto.price,
      stock: dto.stock,
      image_url: dto.imageUrl,
      category_id: dto.categoryId,
      is_active: dto.isActive
    });
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      sku: updated.sku,
      price: Number(updated.price),
      stock: updated.stock,
      imageUrl: updated.image_url,
      isActive: updated.is_active,
      categoryId: updated.category_id,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    };
  }

  async deleteProduct(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
    await productRepository.delete(id);
  }

  async getCategories(page = 1, limit = 20) {
    const { categories, total } = await categoryRepository.findAll(page, limit);
    return {
      categories,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getCategory(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    return category;
  }

  async createCategory(dto: CreateCategoryDto) {
    const existing = await categoryRepository.findByName(dto.name);
    if (existing) throw new AppError('Category name already exists', 409, 'CATEGORY_EXISTS');
    if (dto.parentId) {
      const parent = await categoryRepository.findById(dto.parentId);
      if (!parent) throw new AppError('Parent category not found', 404, 'PARENT_NOT_FOUND');
    }
    return categoryRepository.create({ name: dto.name, description: dto.description, parent_id: dto.parentId });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    if (dto.name && dto.name !== category.name) {
      const existing = await categoryRepository.findByName(dto.name);
      if (existing) throw new AppError('Category name already exists', 409, 'CATEGORY_EXISTS');
    }
    return categoryRepository.update(id, { name: dto.name, description: dto.description, parent_id: dto.parentId, is_active: dto.isActive });
  }

  async deleteCategory(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    await categoryRepository.delete(id);
  }

  async getOrders(page = 1, limit = 20, status?: OrderStatus) {
    const { orders, total } = await orderRepository.getAll(page, limit, status);
    return {
      orders: orders.map((o: OrderWithItemsAndUser) => ({
        id: o.id,
        orderNumber: o.order_number,
        userId: o.user_id,
        userEmail: o.user.email,
        status: o.status,
        totalAmount: Number(o.total_amount),
        shippingAddress: o.shipping_address,
        createdAt: o.created_at,
        updatedAt: o.updated_at
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getOrder(id: string) {
    const fullOrder = await orderRepository.getOrderWithItemsAndUser(id);
    if (!fullOrder) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    return {
      id: fullOrder.id,
      orderNumber: fullOrder.order_number,
      userId: fullOrder.user_id,
      userEmail: fullOrder.user.email,
      status: fullOrder.status,
      totalAmount: Number(fullOrder.total_amount),
      shippingAddress: fullOrder.shipping_address,
      billingAddress: fullOrder.billing_address,
      notes: fullOrder.notes,
      items: fullOrder.items.map(i => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: Number(i.unit_price),
        subtotal: Number(i.unit_price) * i.quantity
      })),
      createdAt: fullOrder.created_at,
      updatedAt: fullOrder.updated_at
    };
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    const updated = await orderRepository.updateStatus(id, status);
    return { id: updated.id, orderNumber: updated.order_number, status: updated.status, updatedAt: updated.updated_at };
  }

  async getUsers(page = 1, limit = 20) {
    const { users, total } = await userRepository.getAll(page, limit);
    return {
      users: users.map(u => ({ id: u.id, email: u.email, fullName: u.full_name, role: u.role, isActive: u.is_active, createdAt: u.created_at })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return { id: user.id, email: user.email, fullName: user.full_name, role: user.role, isActive: user.is_active, createdAt: user.created_at };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    const updated = await userRepository.update(id, { full_name: dto.fullName, is_active: dto.isActive, role: dto.role });
    return { id: updated.id, email: updated.email, fullName: updated.full_name, role: updated.role, isActive: updated.is_active };
  }
}

export const adminService = new AdminService();