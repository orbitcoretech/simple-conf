"use client"

import type React from "react"

import { useRef } from "react"

interface MarkdownEditorProps {
  content: string
  onChange: (content: string) => void
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Handle tab key to insert spaces instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newContent = content.substring(0, start) + "  " + content.substring(end)
      onChange(newContent)

      // Restore cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }

    // Handle bold shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const selectedText = content.substring(start, end)
      const newContent = content.substring(0, start) + "**" + selectedText + "**" + content.substring(end)
      onChange(newContent)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + 2 + selectedText.length
          textareaRef.current.focus()
          textareaRef.current.selectionStart = newPos
          textareaRef.current.selectionEnd = newPos
        }
      }, 0)
    }

    // Handle italic shortcut
    if ((e.metaKey || e.ctrlKey) && e.key === "i") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const selectedText = content.substring(start, end)
      const newContent = content.substring(0, start) + "*" + selectedText + "*" + content.substring(end)
      onChange(newContent)

      setTimeout(() => {
        if (textareaRef.current) {
          const newPos = start + 1 + selectedText.length
          textareaRef.current.focus()
          textareaRef.current.selectionStart = newPos
          textareaRef.current.selectionEnd = newPos
        }
      }, 0)
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your document in Markdown..."
        className="w-full h-full resize-none font-mono text-sm bg-slate-50 p-6 border-0 focus:outline-none focus:ring-0"
      />
    </div>
  )
}
