export type ProductCategory =
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

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
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
  items: Array<{
    productName: string;
    quantity: number;
  }>;
};
