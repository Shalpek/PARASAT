import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const requiredEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

const categoryImages = {
  "Кухонная химия": "/products/kitchen.svg",
  "Средства для уборки": "/products/cleaning.svg",
  "Индустриальная химия": "/products/industrial.svg",
  "Дезинфицирующие средства": "/products/disinfection.svg",
  "Прачечные средства": "/products/laundry.svg",
  "Средства личной гигиены": "/products/hygiene.svg",
};

const seedProducts = [
  ["briller", "Briller", "Кухонная химия", "Средство для удаления накипи", "Для удаления накипи с кухонного оборудования, посуды и рабочих поверхностей.", "5 л"],
  ["vaisselle-tremper", "Vaisselle Tremper", "Кухонная химия", "Дезинфицирующее средство для посуды и приборов", "Для санитарной обработки посуды, приборов и кухонного инвентаря.", "10 л"],
  ["new-grill", "New Grill", "Кухонная химия", "Средство для очистки грилей и духовок", "Для удаления нагара, жира и пригоревших загрязнений.", "5 л"],
  ["gy-carbosolve-t24", "GY Carbosolve T24", "Кухонная химия", "Порошок для удаления жирных и пригорелых пятен", "Для глубокой очистки кухонной посуды, противней и инвентаря.", "10 кг"],
  ["domox", "Domox", "Кухонная химия", "Средство для мытья посуды", "Для ручного мытья посуды на объектах HoReCa.", "5 л"],
  ["hk3-brillant", "Hk3 Brillant", "Средства для уборки", "Жидкость-концентрат для мытья стекол", "Для стекол, зеркал, витрин и глянцевых поверхностей.", "5 л"],
  ["hk10", "Hk10", "Средства для уборки", "Средство для удаления ржавчины в ванных комнатах и туалетах", "Для санитарных зон, душевых, туалетов и влажных помещений.", "5 л"],
  ["santehnik-petrovich", "Сантехник Петрович", "Средства для уборки", "Средство для устранения засоров в трубах", "Для обслуживания канализационных труб и сливов.", "1 л"],
  ["harmonia-plus-professional", "Harmonia Plus Professional", "Средства для уборки", "Универсальное моющее средство", "Для ежедневной уборки коммерческих и общественных помещений.", "5 л"],
  ["maximum-professional", "Maximum Professional", "Средства для уборки", "Средство для удаления устойчивых загрязнений с поверхностей", "Для полов, стен, складских и производственных зон.", "5 л"],
  ["eco-250", "ECO 250", "Индустриальная химия", "Биосид широкого спектра действия", "Для промышленного применения и обработки технологических зон.", "20 л"],
  ["eco-710", "ECO 710", "Индустриальная химия", "Многофункциональный антискалянт", "Для защиты оборудования от накипи и минеральных отложений.", "20 л"],
  ["eco-mr", "ECO MR", "Индустриальная химия", "Моющая добавка для удаления налета и плесени", "Для удаления налета, плесени и сложных загрязнений.", "10 л"],
  ["champion-universal", "CHAMPION универсал", "Индустриальная химия", "Щелочное пенное моющее средство", "Для пенной мойки оборудования и производственных поверхностей.", "22 кг"],
  ["eco-high-foam-vf32", "ECO HIGH FOAM VF32", "Индустриальная химия", "Хлоросодержащее высокопенное жидкое моющее средство", "Для санитарной обработки оборудования и сложных загрязнений.", "22 кг"],
  ["concept", "Concept", "Дезинфицирующие средства", "Дезинфицирующее средство", "Для обеззараживания поверхностей и санитарных зон.", "5 л"],
  ["clean-hands-315", "Clean Hands 315", "Дезинфицирующие средства", "Кожный антисептик", "Для обработки рук персонала и посетителей.", "1 л"],
  ["concept-instru", "Concept Instru", "Дезинфицирующие средства", "Дезинфицирующее средство для инструментов медицинского назначения", "Для обработки инструментов и специализированного инвентаря.", "5 л"],
  ["chlormate", "Chlormate", "Дезинфицирующие средства", "Дезинфектант", "Для дезинфекции рабочих поверхностей и оборудования.", "5 кг"],
  ["concept-surface", "Concept Surface", "Дезинфицирующие средства", "Дезинфицирующее и моющее средство", "Для одновременной мойки и дезинфекции поверхностей.", "5 л"],
  ["laundry-profi", "Laundry Profi", "Прачечные средства", "Жидкое средство для основной стирки", "Для гостиничных прачечных, ресторанного текстиля и спецодежды.", "20 л"],
  ["laundry-profi-strong", "Laundry Profi Strong", "Прачечные средства", "Жидкое средство для основной стирки, усиленная формула", "Для сложных загрязнений и интенсивной профессиональной стирки.", "20 л"],
  ["laundry-alkali-booster", "Laundry Alkali Booster", "Прачечные средства", "Усилитель жидких средств для стирки", "Для повышения моющей способности в профессиональных прачечных.", "10 л"],
  ["laundry-emulsifier", "Laundry Emulsifier", "Прачечные средства", "Усилитель стирки на основе ПАВ", "Для удаления жировых загрязнений с текстиля.", "10 л"],
  ["laundry-optical-brightener", "Laundry Optical Brightener", "Прачечные средства", "Моющая добавка с оптическим отбеливателем", "Для белого белья, скатертей, полотенец и униформы.", "10 л"],
  ["skin-soft", "SKIN SOFT", "Средства личной гигиены", "Крем для тела и рук", "Для номерного фонда гостиниц и санитарных зон.", "500 мл"],
  ["herbal", "HERBAL", "Средства личной гигиены", "Шампунь для волос", "Для гостиниц, SPA-зон и санитарных помещений.", "5 л"],
  ["hair-soft-extra", "HAIR SOFT EXTRA", "Средства личной гигиены", "Шампунь для волос", "Для гостиничного номерного фонда и общественных зон.", "5 л"],
  ["essentiel", "ESSENTIEL", "Средства личной гигиены", "Жидкое мыло-пена для рук", "Для диспенсеров в санузлах, кухнях и общественных помещениях.", "5 л"],
  ["cleanel", "CLEANEL", "Средства личной гигиены", "Антибактериальное жидкое мыло для рук", "Для санитарной обработки рук персонала и гостей.", "5 л"],
].map(([id, name, category, description, purpose, packageSize]) => ({
  id,
  name,
  category,
  description,
  purpose,
  price: "Уточнить цену",
  image: categoryImages[category],
  packageSize,
  inStock: true,
}));

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }
      const [key, ...valueParts] = trimmed.split("=");
      const value = valueParts.join("=").replace(/^['"]|['"]$/g, "");
      process.env[key] ??= value;
    }
  } catch {
    // The caller gets a clear missing-env report below.
  }
}

function getFirebaseConfig() {
  loadEnv();
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing Firebase env variables: ${missing.join(", ")}`);
  }

  return {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
  };
}

async function main() {
  const shouldWrite = process.argv.includes("--write");
  const confirmArg = process.argv.find((arg) => arg.startsWith("--confirm="));
  const isConfirmed = confirmArg === "--confirm=parasat-products";

  const config = getFirebaseConfig();
  console.log(`Seed target project: ${config.projectId}`);
  console.log(`Prepared products: ${seedProducts.length}`);

  if (!shouldWrite || !isConfirmed) {
    console.log("Dry run only. To write: npm run seed:products -- --write --confirm=parasat-products");
    return;
  }

  if (!process.env.FIREBASE_ADMIN_EMAIL || !process.env.FIREBASE_ADMIN_PASSWORD) {
    throw new Error(
      "FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD are required for writing products. Add them to .env and run the seed again.",
    );
  }

  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);

  await signInWithEmailAndPassword(
    auth,
    process.env.FIREBASE_ADMIN_EMAIL,
    process.env.FIREBASE_ADMIN_PASSWORD,
  );
  console.log("Auth login for seed: ok");

  const existingSnapshot = await getDocs(collection(db, "products"));
  const existingProducts = new Map(existingSnapshot.docs.map((productDoc) => [productDoc.id, productDoc.data()]));
  const batch = writeBatch(db);
  let added = 0;
  let skipped = 0;

  for (const product of seedProducts) {
    const productRef = doc(db, "products", product.id);
    if (existingProducts.has(product.id)) {
      skipped += 1;
      continue;
    }

    batch.set(productRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    added += 1;
  }

  if (added > 0) {
    await batch.commit();
  }

  console.log(`Seed complete. Added products: ${added}. Skipped existing products: ${skipped}.`);

  if (auth.currentUser) {
    await signOut(auth);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
