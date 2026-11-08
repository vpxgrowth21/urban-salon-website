export type PriceType = 'fixed' | 'from' | 'range' | 'consultation' | 'variant';
export type CategoryId =
  'hair' | 'facials' | 'threading' | 'waxing' | 'makeup' | 'bridal' | 'nails' | 'packages';
export interface Variant {
  id: string;
  name: string;
  price: number;
  duration: number;
}
export interface Service {
  id: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  description: string;
  price: number | null;
  maxPrice?: number;
  priceType: PriceType;
  duration: number;
  variants?: Variant[];
  addons?: Variant[];
  includes: string[];
  image: string;
  active: boolean;
  featured?: boolean;
  priceIsVerified: false;
  demo: true;
}
export interface Selection {
  serviceId: string;
  variantId?: string;
  addonIds?: string[];
}
export type BookingStatus =
  | 'pending_approval'
  | 'confirmed'
  | 'declined'
  | 'reschedule_proposed'
  | 'cancelled'
  | 'completed'
  | 'no_show';
export type HoldState = 'held' | 'expired' | 'released' | 'allocated';
export interface BookingItem {
  serviceId: string;
  name: string;
  variant?: string;
  addons?: string[];
  price: number;
  duration: number;
}
export interface Booking {
  id: string;
  token: string;
  reference: string;
  idempotencyKey: string;
  name: string;
  phone: string;
  note: string;
  date: string;
  time: string;
  duration: number;
  total: number;
  items: BookingItem[];
  status: BookingStatus;
  holdState: HoldState;
  holdExpiresAt: number;
  createdAt: number;
  proposedDate?: string;
  proposedTime?: string;
  history: { at: number; message: string }[];
}
export interface Hours {
  open: number;
  close: number;
  closedDay: number;
  buffer: number;
  holdMinutes: number;
  noticeMinutes: number;
  advanceDays: number;
}
export interface Enquiry {
  id: string;
  kind: 'bridal' | 'contact';
  name: string;
  phone: string;
  note: string;
  date?: string;
  event?: string;
  people?: number;
  location?: string;
  createdAt: number;
}
export interface DemoState {
  version: 1;
  services: Service[];
  bookings: Booking[];
  enquiries: Enquiry[];
  hours: Hours;
}
export interface RequestPayload {
  selections: Selection[];
  date: string;
  time: string;
  name: string;
  phone: string;
  note: string;
  policy: boolean;
  idempotencyKey: string;
}
export interface Slot {
  time: string;
  label: string;
  state: 'requestable' | 'held' | 'confirmed' | 'unavailable';
  reason?: string;
}
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };
export interface BookingGateway {
  listServices(): Service[];
  getServiceVariants(serviceId: string): Variant[];
  getAvailability(selections: Selection[], date: string): Slot[];
  submitAppointmentRequest(payload: RequestPayload): Result<Booking>;
  getRequestStatus(token: string): Booking | undefined;
  cancelRequest(token: string): Result<Booking>;
  getOwnerRequests(): Booking[];
  approveRequest(id: string): Result<Booking>;
  declineRequest(id: string): Result<Booking>;
  proposeAlternativeTime(id: string, date: string, time: string): Result<Booking>;
}
