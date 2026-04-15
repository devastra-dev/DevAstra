"use client";

import { useAuth } from "@/components/auth/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return <p className="text-center mt-20">Not logged in</p>;

  return (
    <div className="container-page pt-24">

      <div className="glass-panel p-6 max-w-md mx-auto space-y-4">

        <h1 className="text-xl font-semibold">Profile</h1>

        <p>Email: {user.email}</p>

        <p>User ID: {user.uid}</p>

      </div>

    </div>
  );
}