"use client"

import { Search } from "lucide-react"
import { useEffect, useState } from "react"

const placeholderExamples = [
  "How do I integrate Razorpay?",
  "Find e-commerce PRDs",
  "Payment gateway docs",
  "API authentication standards",
  "Deployment process documentation",
]

export function HeroSearch() {
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderExamples.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-semibold text-slate-800">What are you looking for?</h1>
        <p className="text-slate-500">Search our knowledge base using natural language</p>
      </div>

      <div className="w-full max-w-[600px] space-y-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder={placeholderExamples[placeholderIndex]}
            className="h-14 w-full rounded-lg border border-slate-200 bg-white pl-12 pr-4 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
          />
        </div>
        <p className="text-center text-sm text-slate-400">
          Press Enter to search or{" "}
          <kbd className="px-1.5 py-0.5 text-xs font-medium bg-slate-100 border border-slate-200 rounded">⌘K</kbd> from
          anywhere
        </p>
      </div>
    </div>
  )
}
