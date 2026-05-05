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
  id: number;
  name: string;
  category: Category;
  description: string;
  purpose: string;
  price: string;
  image: string;
  stock: boolean;
  createdAt: string;
  volume: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productName: string;
  quantity: number;
};

export type OrderStatus = "Новая" | "В обработке" | "Выполнена" | "Отменена";

export type Order = {
  id: number;
  customerName: string;
  phone: string;
  city: string;
  companyName: string;
  comment: string;
  status: OrderStatus;
  createdAt: string;
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
