"use client"

import { useState } from "react"
import { Folder, Lock, LockOpen, ChevronRight, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FolderNode {
  id: string
  name: string
  count: number
  isAccessible: boolean
  children?: FolderNode[]
}

interface FolderTreeProps {
  folders: FolderNode[]
  currentFolderId?: string
}

function FolderTreeItem({
  folder,
  currentFolderId,
  level = 0,
}: { folder: FolderNode; currentFolderId?: string; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = folder.children && folder.children.length > 0
  const isCurrent = folder.id === currentFolderId

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 text-sm rounded cursor-pointer transition-colors ${
          isCurrent ? "bg-slate-100 font-medium" : "hover:bg-slate-100"
        } ${!folder.isAccessible ? "opacity-60 italic" : ""}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="shrink-0"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
        {!hasChildren && <div className="w-4" />}
        <Folder className="h-4 w-4 text-slate-400 shrink-0" />
        <span className="flex-1 truncate">{folder.name}</span>
        <Badge variant="secondary" className="h-5 text-xs shrink-0">
          {folder.count}
        </Badge>
        {folder.isAccessible ? (
          <LockOpen className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        ) : (
          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {folder.children!.map((child) => (
            <FolderTreeItem key={child.id} folder={child} currentFolderId={currentFolderId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({ folders, currentFolderId }: FolderTreeProps) {
  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <FolderTreeItem key={folder.id} folder={folder} currentFolderId={currentFolderId} />
      ))}
    </div>
  )
}
