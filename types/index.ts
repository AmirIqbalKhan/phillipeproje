// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'superadmin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  price: number;
  capacity: number;
  category: EventCategory;
  organizerId: string;
  organizer: User;
  images: string[];
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory = 
  | 'concert' 
  | 'workshop' 
  | 'conference' 
  | 'meetup' 
  | 'sports' 
  | 'food' 
  | 'art' 
  | 'technology' 
  | 'business' 
  | 'other';

// RSVP Types
export interface RSVP {
  id: string;
  userId: string;
  eventId: string;
  status: 'going' | 'maybe' | 'not-going';
  user: User;
  event: Event;
  createdAt: Date;
}

// Payment Types
export interface Payment {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  user: User;
  event: Event;
  createdAt: Date;
}

export interface PaymentSplit {
  id: string;
  eventId: string;
  totalAmount: number;
  participants: PaymentSplitParticipant[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface PaymentSplitParticipant {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  user: User;
}

// Venue Types
export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  amenities: string[];
  images: string[];
  organizerId: string;
  organizer: User;
  createdAt: Date;
}

// Staff Types
export interface Staff {
  id: string;
  userId: string;
  eventId: string;
  role: 'coordinator' | 'assistant' | 'security' | 'catering' | 'technical';
  user: User;
  event: Event;
  createdAt: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  sender: User;
  receiver: User;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter Types
export interface EventFilters {
  category?: EventCategory;
  city?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

// Dashboard Types
export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRSVPs: number;
  totalRevenue: number;
}

export interface AdminStats extends DashboardStats {
  totalUsers: number;
  totalVenues: number;
  totalStaff: number;
  pendingApprovals: number;
}

export interface SuperAdminStats extends AdminStats {
  platformRevenue: number;
  activeUsers: number;
  totalOrganizers: number;
  systemHealth: 'good' | 'warning' | 'critical';
} 