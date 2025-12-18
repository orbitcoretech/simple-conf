import { Calendar, Eye, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MetadataBarProps {
  createdBy: { name: string; avatar: string }
  modifiedBy: { name: string; avatar: string }
  updatedAt: string
  views: number
  commentCount: number
}

export function MetadataBar({ createdBy, modifiedBy, updatedAt, views, commentCount }: MetadataBarProps) {
  const showModifiedBy = createdBy.name !== modifiedBy.name

  return (
    <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
      {/* Created by */}
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback className="text-xs">{createdBy.avatar}</AvatarFallback>
        </Avatar>
        <span>
          Created by <span className="font-medium text-slate-700">{createdBy.name}</span>
        </span>
      </div>

      <span className="text-slate-300">|</span>

      {/* Modified by (if different) */}
      {showModifiedBy && (
        <>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{modifiedBy.avatar}</AvatarFallback>
            </Avatar>
            <span>
              Modified by <span className="font-medium text-slate-700">{modifiedBy.name}</span>
            </span>
          </div>
          <span className="text-slate-300">|</span>
        </>
      )}

      {/* Last updated */}
      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4" />
        <span>Updated {updatedAt}</span>
      </div>

      <span className="text-slate-300">|</span>

      {/* View count */}
      <div className="flex items-center gap-1.5">
        <Eye className="h-4 w-4" />
        <span>{views} views</span>
      </div>

      <span className="text-slate-300">|</span>

      {/* Comment count */}
      <div className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        <span>
          {commentCount} {commentCount === 1 ? "comment" : "comments"}
        </span>
      </div>
    </div>
  )
}
