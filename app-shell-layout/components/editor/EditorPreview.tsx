"use client"

import { useState, useEffect } from "react"
import { MarkdownRenderer } from "@/components/document/MarkdownRenderer"

interface EditorPreviewProps {
  content: string
}

export function EditorPreview({ content }: EditorPreviewProps) {
  const [debouncedContent, setDebouncedContent] = useState(content)

  // Debounce content updates for 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedContent(content)
    }, 300)

    return () => clearTimeout(timer)
  }, [content])

  if (!debouncedContent.trim()) {
    return <div className="flex-1 flex items-center justify-center text-slate-400">Start typing to see preview...</div>
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <MarkdownRenderer content={debouncedContent} />
    </div>
  )
}
