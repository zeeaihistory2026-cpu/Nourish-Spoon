import { Product, Order, Review, FAQ, PaymentMethod, DeliveryMethod } from '@packages/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_FAQS, INITIAL_PAYMENT_METHODS, INITIAL_DELIVERY_METHODS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

class StoreService {
  private products: Product[] = [];
  private orders: Order[] = [];
  private reviews: Review[] = [];
  private faqs: FAQ[] = [];
  private paymentMethods: PaymentMethod[] = [];
  private deliveryMethods: DeliveryMethod[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadInitialState();
  }

  private loadInitialState() {
    try {
      const p = localStorage.getItem('ns_admin_products');
      this.products = p ? JSON.parse(p) : INITIAL_PRODUCTS;

      const o = localStorage.getItem('ns_admin_orders');
      this.orders = o ? JSON.parse(o) : INITIAL_ORDERS;

      const r = localStorage.getItem('ns_admin_reviews');
      this.reviews = r ? JSON.parse(r) : INITIAL_REVIEWS;

      const f = localStorage.getItem('ns_admin_faqs');
      this.faqs = f ? JSON.parse(f) : INITIAL_FAQS;

      const pm = localStorage.getItem('ns_admin_payments');
      this.paymentMethods = pm ? JSON.parse(pm) : INITIAL_PAYMENT_METHODS;

      const dm = localStorage.getItem('ns_admin_delivery');
      this.deliveryMethods = dm ? JSON.parse(dm) : INITIAL_DELIVERY_METHODS;
    } catch {
      this.products = INITIAL_PRODUCTS;
      this.orders = INITIAL_ORDERS;
      this.reviews = INITIAL_REVIEWS;
      this.faqs = INITIAL_FAQS;
      this.paymentMethods = INITIAL_PAYMENT_METHODS;
      this.deliveryMethods = INITIAL_DELIVERY_METHODS;
    }
  }

  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  // PRODUCTS
  public getProducts(): Product[] {
    return this.products;
  }

  public addProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`
    };
    this.products.unshift(newProduct);
    localStorage.setItem('ns_admin_products', JSON.stringify(this.products));
    this.notify();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>) {
    this.products = this.products.map(p => p.id === id ? { ...p, ...updates } : p);
    localStorage.setItem('ns_admin_products', JSON.stringify(this.products));
    this.notify();
  }

  public deleteProduct(id: string) {
    this.products = this.products.filter(p => p.id !== id);
    localStorage.setItem('ns_admin_products', JSON.stringify(this.products));
    this.notify();
  }

  // ORDERS
  public getOrders(): Order[] {
    return this.orders;
  }

  public updateOrderStatus(orderId: string, status: Order['status']) {
    this.orders = this.orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem('ns_admin_orders', JSON.stringify(this.orders));
    this.notify();
  }

  public addOrder(order: Order) {
    this.orders.unshift(order);
    localStorage.setItem('ns_admin_orders', JSON.stringify(this.orders));
    this.notify();
  }

  // REVIEWS
  public getReviews(): Review[] {
    return this.reviews;
  }

  public updateReviewStatus(reviewId: string, status: Review['status']) {
    this.reviews = this.reviews.map(r => r.id === reviewId ? { ...r, status } : r);
    localStorage.setItem('ns_admin_reviews', JSON.stringify(this.reviews));
    this.notify();
  }

  public toggleFeatureReview(reviewId: string) {
    this.reviews = this.reviews.map(r => r.id === reviewId ? { ...r, is_featured: !r.is_featured } : r);
    localStorage.setItem('ns_admin_reviews', JSON.stringify(this.reviews));
    this.notify();
  }

  public deleteReview(reviewId: string) {
    this.reviews = this.reviews.filter(r => r.id !== reviewId);
    localStorage.setItem('ns_admin_reviews', JSON.stringify(this.reviews));
    this.notify();
  }

  // FAQS
  public getFAQs(): FAQ[] {
    return this.faqs;
  }

  public addFAQ(faq: Omit<FAQ, 'id'>) {
    const newFaq: FAQ = { ...faq, id: `faq_${Date.now()}` };
    this.faqs.push(newFaq);
    localStorage.setItem('ns_admin_faqs', JSON.stringify(this.faqs));
    this.notify();
  }

  public updateFAQ(id: string, updates: Partial<FAQ>) {
    this.faqs = this.faqs.map(f => f.id === id ? { ...f, ...updates } : f);
    localStorage.setItem('ns_admin_faqs', JSON.stringify(this.faqs));
    this.notify();
  }

  public deleteFAQ(id: string) {
    this.faqs = this.faqs.filter(f => f.id !== id);
    localStorage.setItem('ns_admin_faqs', JSON.stringify(this.faqs));
    this.notify();
  }

  // PAYMENTS & DELIVERY
  public getPaymentMethods(): PaymentMethod[] {
    return this.paymentMethods;
  }

  public togglePaymentMethod(id: string) {
    this.paymentMethods = this.paymentMethods.map(pm => pm.id === id ? { ...pm, active: !pm.active } : pm);
    localStorage.setItem('ns_admin_payments', JSON.stringify(this.paymentMethods));
    this.notify();
  }

  public getDeliveryMethods(): DeliveryMethod[] {
    return this.deliveryMethods;
  }

  public toggleDeliveryMethod(id: string) {
    this.deliveryMethods = this.deliveryMethods.map(dm => dm.id === id ? { ...dm, active: !dm.active } : dm);
    localStorage.setItem('ns_admin_delivery', JSON.stringify(this.deliveryMethods));
    this.notify();
  }
}

export const storeService = new StoreService();
