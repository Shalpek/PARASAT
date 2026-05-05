import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
    // The missing-env report below is enough.
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
  const shouldWriteTests = process.argv.includes("--write-tests");
  const confirmArg = process.argv.find((arg) => arg.startsWith("--confirm="));
  const isConfirmed = confirmArg === "--confirm=parasat-firebase-test";

  const config = getFirebaseConfig();
  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getFirestore(app);

  console.log("env: ok");
  console.log(`firebase app: ok (${config.projectId})`);
  console.log("auth instance: ok");
  console.log("firestore instance: ok");

  if (process.env.FIREBASE_ADMIN_EMAIL && process.env.FIREBASE_ADMIN_PASSWORD) {
    await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_ADMIN_EMAIL,
      process.env.FIREBASE_ADMIN_PASSWORD,
    );
    console.log("auth login: ok");
  } else {
    console.log("auth login: skipped (FIREBASE_ADMIN_EMAIL/PASSWORD not set)");
  }

  const productsSnapshot = await getDocs(query(collection(db, "products"), limit(1)));
  console.log(`firestore products read: ok (${productsSnapshot.size} sample docs)`);

  const ordersSnapshot = await getDocs(query(collection(db, "orders"), limit(1)));
  console.log(`firestore orders read: ok (${ordersSnapshot.size} sample docs)`);

  if (!shouldWriteTests || !isConfirmed) {
    console.log("write tests: skipped. To run: npm run firebase:check -- --write-tests --confirm=parasat-firebase-test");
    if (auth.currentUser) {
      await signOut(auth);
    }
    return;
  }

  const productRef = doc(db, "products", "firebase-integration-test-product");
  await setDoc(productRef, {
    id: productRef.id,
    name: "Firebase Integration Test Product",
    category: "Кухонная химия",
    description: "Temporary product for Firebase integration check.",
    purpose: "Temporary integration check.",
    price: "Уточнить цену",
    image: "/products/kitchen.svg",
    packageSize: "1 л",
    inStock: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log("product create: ok");

  await updateDoc(productRef, {
    name: "Firebase Integration Test Product Updated",
    updatedAt: serverTimestamp(),
  });
  const updatedProduct = await getDoc(productRef);
  console.log(`product edit: ${updatedProduct.exists() ? "ok" : "failed"}`);

  await deleteDoc(productRef);
  const deletedProduct = await getDoc(productRef);
  console.log(`product delete: ${deletedProduct.exists() ? "failed" : "ok"}`);

  const orderRef = await addDoc(collection(db, "orders"), {
    customerName: "Firebase Test",
    phone: "+7 700 000 00 00",
    city: "Астана",
    companyName: "Firebase Integration Test",
    comment: "Temporary order created by firebase:check.",
    items: [{ productName: "Briller", quantity: 1 }],
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(orderRef, { id: orderRef.id });
  console.log(`order create: ok (${orderRef.id})`);

  await updateDoc(orderRef, {
    status: "processing",
    updatedAt: serverTimestamp(),
  });
  console.log("order status update: ok");

  if (auth.currentUser) {
    await signOut(auth);
    console.log("auth logout: ok");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
