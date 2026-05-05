import type { Order } from "../types";

export const orders: Order[] = [
  {
    id: 1001,
    customerName: "Алия",
    phone: "+7 777 777 77 77",
    city: "Астана",
    companyName: "Ресторан Example",
    comment: "Нужна консультация по объему для кухни и санузлов.",
    status: "Новая",
    createdAt: "2026-05-02",
    items: [
      { productName: "Briller", quantity: 2 },
      { productName: "Concept Surface", quantity: 3 },
    ],
  },
  {
    id: 1002,
    customerName: "Марат",
    phone: "+7 701 222 11 00",
    city: "Астана",
    companyName: "Hotel Central",
    comment: "Поставка для прачечной и номерного фонда.",
    status: "В обработке",
    createdAt: "2026-05-03",
    items: [
      { productName: "Laundry Profi", quantity: 4 },
      { productName: "Sunpaper Towel V", quantity: 10 },
    ],
  },
  {
    id: 1003,
    customerName: "Динара",
    phone: "+7 702 444 55 66",
    city: "Алматы",
    companyName: "Catering Pro",
    comment: "Нужна упаковка для выездных мероприятий.",
    status: "Выполнена",
    createdAt: "2026-04-29",
    items: [
      { productName: "Food Box Kraft", quantity: 20 },
      { productName: "Eco Plate Pro", quantity: 15 },
    ],
  },
];
