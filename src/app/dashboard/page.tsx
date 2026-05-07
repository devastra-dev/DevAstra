import { DashboardView } from "@/components/dashboard/DashboardView";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="relative overflow-hidden min-h-screen" style={{ position: "relative" }}>

        {/* Ambient blobs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full top-[-120px] left-1/3"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(100px)" }} />
          <div className="absolute w-[400px] h-[400px] rounded-full bottom-[-100px] right-10"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,0.09) 0%, transparent 70%)", filter: "blur(100px)" }} />
        </div>

        <div className="container-page pt-28 pb-20 space-y-8">

          {/* Header */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-mono text-violet-400 uppercase tracking-[0.25em]">System :: Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your Library
            </h1>
            <p className="text-slate-400 text-sm">Manage your purchases, downloads, and licenses.</p>
          </div>

          {/* Dashboard content */}
          <DashboardView />

        </div>
      </main>
    </ProtectedRoute>
  );
}