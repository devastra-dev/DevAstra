"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleAdd = async () => {
    if (!title || !price || !downloadUrl) {
      alert("All fields required");
      return;
    }

    const id = title.toLowerCase().replace(/\s+/g, "-");

    await addDoc(collection(db, "products"), {
      id,
      title,
      priceInINR: Number(price),
      downloadUrl
    });

    alert("Product added ✅");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Panel</h1>

      <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
      <br />

      <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <br />

      <input placeholder="Drive URL" onChange={(e) => setDownloadUrl(e.target.value)} />
      <br />

      <button onClick={handleAdd}>Add Product</button>
    </div>
  );
}