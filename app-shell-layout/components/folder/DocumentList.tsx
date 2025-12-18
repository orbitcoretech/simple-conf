"use client"

import { FileText, Eye, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

interface Document {
  id: number
  title: string
  updatedAt: string
  owner: string
  views: number
}

interface DocumentListProps {
  documents: Document[]
  selectedId: number | null
  onSelect: (id: number) => void
  onOpen: (id: number) => void
}

export function DocumentList({ documents, selectedId, onSelect, onOpen }: DocumentListProps) {
  if (documents.length === 0) {
    return (
      <Card className="p-12 flex flex-col items-center justify-center text-center">
        <FileText className="h-16 w-16 text-slate-300 mb-4" />
        <p className="text-lg text-slate-500 mb-2">No documents in this folder</p>
        <p className="text-sm text-slate-400">Create the first document to get started</p>
      </Card>
    )
  }

  return (
    <Card className="divide-y divide-slate-100">
      {documents.map((doc) => {
        const isSelected = doc.id === selectedId

        return (
          <div
            key={doc.id}
            className={`py-3 px-4 cursor-pointer transition-colors group relative ${
              isSelected ? "bg-blue-50 border-l-2 border-[#2563EB]" : "hover:bg-slate-50 border-l-2 border-transparent"
            }`}
            onClick={() => onSelect(doc.id)}
            onDoubleClick={() => onOpen(doc.id)}
          >
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-slate-900 mb-1">{doc.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>Updated {doc.updatedAt}</span>
                  <span>•</span>
                  <span>{doc.owner}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    <span>{doc.views}</span>
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 shrink-0 transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </div>
          </div>
        )
      })}
    </Card>
  )
}
