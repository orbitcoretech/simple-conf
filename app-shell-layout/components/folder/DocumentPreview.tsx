"use client"

import { X, Eye, MessageCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DocumentPreviewProps {
  document: {
    id: number
    title: string
    updatedAt: string
    owner: string
    views: number
    comments: number
    preview: string
  }
  onClose: () => void
}

export function DocumentPreview({ document, onClose }: DocumentPreviewProps) {
  return (
    <Card className="sticky top-6 shadow-lg border-l bg-white animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-start justify-between">
        <h2 className="text-lg font-semibold pr-8">{document.title}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0 focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content Preview */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-medium text-slate-700 mb-2">Preview</h3>
          <p className="text-sm text-slate-600 leading-relaxed">{document.preview}</p>
        </div>

        {/* Metadata */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Owner</span>
            <span className="font-medium text-slate-900">{document.owner}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Last updated</span>
            <span className="text-slate-900">{document.updatedAt}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Views</span>
            <div className="flex items-center gap-1 text-slate-900">
              <Eye className="h-3.5 w-3.5" />
              <span>{document.views}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Comments</span>
            <div className="flex items-center gap-1 text-slate-900">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>{document.comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Button className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]">
          Open Document
        </Button>
      </div>
    </Card>
  )
}
