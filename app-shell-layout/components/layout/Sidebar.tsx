"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderTree } from "@/components/folder/FolderTree"

// Mock data
const folderTree = [
  {
    id: "sales",
    name: "Sales",
    count: 24,
    isAccessible: true,
    children: [
      { id: "pg", name: "Payment Gateways", count: 7, isAccessible: true },
      { id: "merchants", name: "Merchant Accounts", count: 5, isAccessible: true },
    ],
  },
  {
    id: "eng",
    name: "Engineering",
    count: 45,
    isAccessible: true,
    children: [
      { id: "frontend", name: "Frontend", count: 18, isAccessible: true },
      { id: "backend", name: "Backend", count: 27, isAccessible: true },
    ],
  },
  { id: "hr", name: "HR", count: 12, isAccessible: false, children: [] },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`border-r bg-slate-50 transition-all duration-200 shrink-0 ${isCollapsed ? "w-16" : "w-[280px]"}`}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="h-12 flex items-center justify-end px-2 border-b border-slate-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {!isCollapsed && <FolderTree folders={folderTree} currentFolderId="pg" />}
        </div>
      </div>
    </aside>
  )
}
