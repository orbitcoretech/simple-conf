import type { ReactNode } from "react"
import { Card } from "@/components/ui/card"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">SimpleConf</h1>
          <p className="text-slate-500 text-sm">Find knowledge, not folders</p>
        </div>

        <Card className="bg-white shadow-lg rounded-xl p-8">{children}</Card>
      </div>
    </div>
  )
}
