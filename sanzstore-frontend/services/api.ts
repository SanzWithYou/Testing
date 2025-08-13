import apiClient from './apiClient';
import {
  Product,
  User,
  Order,
  SellerApplication,
  ChatConversation,
  ChatMessage,
  Testimonial,
} from '../types';

// =================================================================
// AUTH & USER TYPE DEFINITIONS
// =================================================================
export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// =================================================================
// API SERVICE
// =================================================================

// --- AUTHENTICATION API ---
export const signUp = async (credentials: SignUpCredentials): Promise<void> => {
  await apiClient.get('/sanctum/csrf-cookie'); // ✅ WAJIB PANGGIL sebelum POST auth
  await apiClient.post('/api/register', credentials);
};

export const signIn = async (credentials: AuthCredentials): Promise<User> => {
  await apiClient.get('/sanctum/csrf-cookie'); // ✅ WAJIB PANGGIL sebelum POST auth
  await apiClient.post('/api/login', credentials);
  const { data } = await apiClient.get('/api/user');
  return data;
};

export const signOut = async (): Promise<void> => {
  await apiClient.post('/logout'); // CSRF sudah aktif
};

export const getProfileForUser = async (): Promise<User | null> => {
  try {
    const { data } = await apiClient.get('/api/user');
    return data;
  } catch (error: any) {
    if (error.response && (error.response.status === 401 || error.response.status === 419)) {
      return null;
    }
    throw error;
  }
};

// --- PRODUCT APIs ---
export const fetchProducts = async (
  filters?: {
    searchTerm?: string;
    categories?: string[];
    priceRange?: [number, number];
    minRating?: number;
  },
  sort?: string,
  page?: number,
  limit?: number
): Promise<{ data: Product[]; total: number; hasMore: boolean }> => {
  const { data } = await apiClient.get('/api/products', {
    params: { filters, sort, page, limit },
  });
  return data;
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data } = await apiClient.get(`/api/products/${id}`);
  return data;
};

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
  const { data } = await apiClient.get('/api/testimonials');
  return data;
};

// --- ORDER APIs ---
export const createOrder = async (product: Product, user: User): Promise<Order> => {
  const { data } = await apiClient.post('/api/orders', { product_id: product.id });
  return data;
};

export const fetchUserOrders = async (userId: string): Promise<Order[]> => {
  const { data } = await apiClient.get(`/api/users/${userId}/orders`);
  return data;
};

// --- SELLER APIs ---
export const applyToBeSeller = async (
  applicationData: Partial<
    Omit<
      SellerApplication,
      'id' | 'user_id' | 'user_name' | 'user_email' | 'status' | 'submitted_at'
    >
  >,
  applyingUser: User
): Promise<void> => {
  await apiClient.post('/api/seller-applications', applicationData);
};

export const fetchSellerApplication = async (
  userId: string
): Promise<SellerApplication | null> => {
  const { data } = await apiClient.get(`/api/users/${userId}/seller-application`);
  return data;
};

export const fetchSellerProducts = async (sellerId: string): Promise<Product[]> => {
  const { data } = await apiClient.get(`/api/sellers/${sellerId}/products`);
  return data;
};

export const addProduct = async (
  productData: Omit<
    Product,
    'id' | 'created_at' | 'image_url' | 'seller_id' | 'seller_name' | 'status' | 'sub_category' | 'seller_rating'
  >,
  imageFile: File,
  seller: User
): Promise<Product> => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  formData.append('image', imageFile);

  const { data } = await apiClient.post('/api/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateProduct = async (
  productId: string,
  productData: Partial<Product>,
  imageFile: File | null
): Promise<Product> => {
  const formData = new FormData();
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });
  if (imageFile) {
    formData.append('image', imageFile);
  }
  formData.append('_method', 'PUT');

  const { data } = await apiClient.post(`/api/products/${productId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await apiClient.delete(`/api/products/${productId}`);
};

// --- CHAT APIs ---
export const fetchUserConversations = async (userId: string): Promise<ChatConversation[]> => {
  const { data } = await apiClient.get(`/api/users/${userId}/conversations`);
  return data;
};

export const fetchMessagesForConversation = async (
  conversationId: string
): Promise<ChatMessage[]> => {
  const { data } = await apiClient.get(`/api/conversations/${conversationId}/messages`);
  return data;
};

export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: User
): Promise<ChatMessage> => {
  const { data } = await apiClient.post(`/api/conversations/${conversationId}/messages`, {
    text,
  });
  return data;
};

// --- ADMIN APIs ---
export const fetchAllUsers = async (): Promise<User[]> => {
  const { data } = await apiClient.get('/api/admin/users');
  return data;
};

export const updateUserRoles = async (
  userId: string,
  roles: string[]
): Promise<User> => {
  const { data } = await apiClient.put(`/api/admin/users/${userId}/roles`, { roles });
  return data;
};

export const updateUserStatus = async (
  userId: string,
  status: 'active' | 'blocked'
): Promise<User> => {
  const { data } = await apiClient.put(`/api/admin/users/${userId}/status`, { status });
  return data;
};

export const fetchAllOrders = async (): Promise<Order[]> => {
  const { data } = await apiClient.get('/api/admin/orders');
  return data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<Order> => {
  const { data } = await apiClient.put(`/api/admin/orders/${orderId}/status`, { status });
  return data;
};

export const fetchAllSellerApplications = async (): Promise<SellerApplication[]> => {
  const { data } = await apiClient.get('/api/admin/seller-applications');
  return data;
};

export const manageSellerApplication = async (
  appId: string,
  action: 'approved' | 'rejected',
  reason?: string
): Promise<void> => {
  await apiClient.post(`/api/admin/seller-applications/${appId}/manage`, { action, reason });
};

export const fetchAllAdminProducts = async (): Promise<Product[]> => {
  const { data } = await apiClient.get('/api/admin/products');
  return data;
};

export const fetchAdminStats = async (): Promise<{
  users: number;
  products: number;
  orders: number;
}> => {
  const { data } = await apiClient.get('/api/admin/stats');
  return data;
};

export const fetchAllConversations = async (): Promise<ChatConversation[]> => {
  const { data } = await apiClient.get('/api/admin/conversations');
  return data;
};
