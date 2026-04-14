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
      imageUrl: p.imageUrl,
      isActive: p.isActive,
      categoryId: p.categoryId,
      categoryName: p.category.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
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
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
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
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId
    });
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      sku: product.sku,
      price: Number(product.price),
      stock: product.stock,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
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
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId,
      isActive: dto.isActive
    });
    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      sku: updated.sku,
      price: Number(updated.price),
      stock: updated.stock,
      imageUrl: updated.imageUrl,
      isActive: updated.isActive,
      categoryId: updated.categoryId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt
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
    return categoryRepository.create({ name: dto.name, description: dto.description, parentId: dto.parentId });
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND');
    if (dto.name && dto.name !== category.name) {
      const existing = await categoryRepository.findByName(dto.name);
      if (existing) throw new AppError('Category name already exists', 409, 'CATEGORY_EXISTS');
    }
    return categoryRepository.update(id, { name: dto.name, description: dto.description, parentId: dto.parentId, isActive: dto.isActive });
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
        orderNumber: o.orderNumber,
        userId: o.userId,
        userEmail: o.user.email,
        status: o.status,
        totalAmount: Number(o.totalAmount),
        shippingAddress: o.shippingAddress,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getOrder(id: string) {
    const fullOrder = await orderRepository.getOrderWithItemsAndUser(id);
    if (!fullOrder) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    return {
      id: fullOrder.id,
      orderNumber: fullOrder.orderNumber,
      userId: fullOrder.userId,
      userEmail: fullOrder.user.email,
      status: fullOrder.status,
      totalAmount: Number(fullOrder.totalAmount),
      shippingAddress: fullOrder.shippingAddress,
      billingAddress: fullOrder.billingAddress,
      notes: fullOrder.notes,
      items: fullOrder.items.map(i => ({
        id: i.id,
        productId: i.productId,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        subtotal: Number(i.unitPrice) * i.quantity
      })),
      createdAt: fullOrder.createdAt,
      updatedAt: fullOrder.updatedAt
    };
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const order = await orderRepository.findById(id);
    if (!order) throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
    const updated = await orderRepository.updateStatus(id, status);
    return { id: updated.id, orderNumber: updated.orderNumber, status: updated.status, updatedAt: updated.updatedAt };
  }

  async getUsers(page = 1, limit = 20) {
    const { users, total } = await userRepository.getAll(page, limit);
    return {
      users: users.map(u => ({ id: u.id, email: u.email, fullName: u.fullName, role: u.role, isActive: u.isActive, createdAt: u.createdAt })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  async getUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    return { id: user.id, email: user.email, fullName: user.fullName, role: user.role, isActive: user.isActive, createdAt: user.createdAt };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    const updated = await userRepository.update(id, { fullName: dto.fullName, isActive: dto.isActive, role: dto.role });
    return { id: updated.id, email: updated.email, fullName: updated.fullName, role: updated.role, isActive: updated.isActive };
  }
}

export const adminService = new AdminService();