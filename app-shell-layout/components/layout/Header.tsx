"use client"

import { BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserMenu } from "./UserMenu"

export function Header() {
  return (
    <header className="h-16 border-b bg-white flex items-center px-6 gap-6">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <BookOpen className="h-5 w-5 text-[#2563EB]" />
        <span className="text-lg font-semibold text-foreground">SimpleConf</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-[480px] mx-auto relative group">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Ask a question or search..."
            className="pl-10 pr-16 rounded-full border-input focus-visible:ring-2 focus-visible:ring-[#2563EB] transition-all duration-200"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-focus-within:opacity-0 transition-opacity">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* User Menu */}
      <UserMenu />
    </header>
  )
}
