export type Category =
  | "Кухонная химия"
  | "Средства для уборки"
  | "Индустриальная химия"
  | "Дезинфицирующие средства"
  | "Прачечные средства"
  | "Средства личной гигиены"
  | "Бумажная продукция"
  | "Одноразовая посуда"
  | "Упаковочные материалы"
  | "Средства индивидуальной защиты";

export type ProductCategory = Category;

export type Product = {
  id: string;
  name: string;
  category: Category;
  description: string;
  purpose: string;
  price: string;
  image: string;
  packageSize: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export type CartItem = {
  product: Product;
  quantity: number;
};

export type UserRole = "customer" | "admin";

export type UserProfile = {
  uid: string;
  email: string;
  role: UserRole;
  fullName: string;
  phone: string;
  city: string;
  companyName: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type UserProfileInput = {
  fullName: string;
  phone: string;
  city: string;
  companyName: string;
  address: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export type OrderStatus =
  | "created"
  | "waiting_payment"
  | "paid"
  | "delivery_created"
  | "in_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type DeliveryStatus =
  | "not_created"
  | "calculating"
  | "created"
  | "courier_assigned"
  | "in_delivery"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "kaspi_mock";

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  companyName: string;
  comment: string;
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = Omit<Order, "id" | "createdAt" | "updatedAt">;

export type PaymentRecord = {
  id: string;
  orderId: string;
  userId: string;
  provider: "kaspi_mock";
  amount: number;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
};

export type DeliveryRecord = {
  id: string;
  orderId: string;
  userId: string;
  provider: "yandex_delivery_mock";
  city: string;
  address: string;
  price: number;
  status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
};
