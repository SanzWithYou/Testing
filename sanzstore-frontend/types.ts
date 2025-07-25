// 📁 sanzstore-frontend/src/types.ts

export interface Product {
    id: string; // Pastikan string untuk UUID
    name: string;
    category: string;
    sub_category: string;
    price: number;
    description: string;
    image_url: string;
    seller_id: string; // Pastikan string untuk UUID/ID
    seller_name: string;
    seller_rating: number;
    status: 'available' | 'sold';
    account_username: string;
    account_password: string;
    is_email_verified: boolean;
    created_at: string;
}

export interface User {
    id: string; // Pastikan string untuk ID
    name: string;
    email: string;
    roles: string[];
    store_name?: string;
    application_status?: 'none' | 'pending' | 'approved' | 'rejected';
    status: 'active' | 'blocked';
}

export interface Order {
    id: string; // Pastikan string untuk ID
    product_id: string; // Pastikan string untuk UUID
    product_name: string;
    user_id: string; // Pastikan string untuk ID
    user_name: string;
    seller_id: string; // Pastikan string untuk ID
    date: string; // ISO string
    status: 'pending' | 'processing' | 'delivered' | 'completed' | 'cancelled'; // Updated from frontend's 'Pending' to 'pending' to match backend enum
    price: number;
    account_username?: string;
    account_password?: string;
    is_email_verified?: boolean;
    payment_method: 'COD' | 'Transfer' | 'Wallet' | 'Midtrans'; // Tambah Midtrans jika perlu
    activity_log: { timestamp: string; activity: string; }[];
}

export interface SellerApplication {
    id: string; // Pastikan string untuk UUID
    user_id: string; // Pastikan string untuk ID
    user_name: string;
    user_email: string;
    store_name: string;
    description: string;
    status: 'pending' | 'approved' | 'rejected';
    rejection_reason?: string;
    submitted_at: string;
    contact_email: string;
    contact_phone: string;
    game_types: string[];
    payment_methods: string[];
    social_link?: string;
    id_document_url?: string;
}

export interface ChatMessage {
    id: string; // Pastikan string untuk UUID
    conversation_id: string; // Pastikan string untuk UUID
    sender_id: string; // Pastikan string untuk ID
    text: string;
    timestamp: string;
}

export interface ChatConversation {
    id: string; // Pastikan string untuk UUID
    buyer_id: string; // Pastikan string untuk ID
    buyer_name: string;
    seller_id: string; // Pastikan string untuk ID
    seller_name: string;
    product_id: string; // Pastikan string untuk UUID
    product_name: string;
    last_message: string;
    last_message_timestamp: string;
}

export interface Testimonial {
    id: string; // Pastikan string untuk UUID
    user_name: string;
    user_avatar_url: string;
    comment: string;
    game: string; // Asumsi ini adalah category dari Product yang diulas
}

// --- PERBAIKAN: SESUAIKAN DENGAN PEMBAHASAN SEBELUMNYA ---
export interface SignUpCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string; // <--- PERUBAHAN KRUSIAL
}