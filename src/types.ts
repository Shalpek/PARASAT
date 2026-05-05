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

export type OrderItem = {
  productName: string;
  quantity: number;
};

export type OrderStatus = "new" | "processing" | "completed" | "cancelled";

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  city: string;
  companyName: string;
  comment: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
};

export type CreateOrderInput = {
  customerName: string;
  phone: string;
  city: string;
  companyName: string;
  comment: string;
  items: OrderItem[];
};
