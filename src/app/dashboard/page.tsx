import { DashboardView } from "@/components/dashboard/DashboardView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="relative overflow-hidden min-h-screen">

        {/* 🌌 BACKGROUND GLOW */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-120px] left-1/3 animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-120px] right-10 animate-pulse" />
        </div>

        <div className="container-page pt-28 pb-20 space-y-10">

          {/* 🔥 HEADER */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Your Dashboard
            </h1>

            <p className="text-slate-400 text-sm">
              Manage your purchases, downloads, and licenses.
            </p>
          </div>

          {/* 📦 MAIN DASHBOARD */}
          <DashboardView />

        </div>

      </main>
    </ProtectedRoute>
  );
}