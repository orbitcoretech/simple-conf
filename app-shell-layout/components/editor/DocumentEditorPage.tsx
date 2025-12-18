"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditorToolbar } from "./EditorToolbar"
import { MarkdownEditor } from "./MarkdownEditor"
import { EditorPreview } from "./EditorPreview"
import { UnsavedChangesDialog } from "./UnsavedChangesDialog"

// Mock data - in real app, fetch from API based on URL params
const existingDocument = {
  id: 1,
  title: "Razorpay Integration Guide",
  content: `# Overview

This guide covers the complete integration of Razorpay.

## Prerequisites

- Node.js 18+
- Razorpay account

## Installation

\`\`\`bash
npm install razorpay
\`\`\`

## Configuration

Create a \`.env\` file with your credentials:

\`\`\`env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
\`\`\`

## Basic Usage

\`\`\`javascript
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
\`\`\`
`,
}

export function DocumentEditorPage() {
  const [title, setTitle] = useState(existingDocument.title)
  const [content, setContent] = useState(existingDocument.content)
  const [originalTitle] = useState(existingDocument.title)
  const [originalContent] = useState(existingDocument.content)
  const [leftWidth, setLeftWidth] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)

  const hasUnsavedChanges = title !== originalTitle || content !== originalContent
  const canSave = title.trim().length > 0 && hasUnsavedChanges

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        if (canSave) handleSave()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [canSave, title, content])

  // Warn on navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleSave = () => {
    console.log("[v0] Saving document:", { title, content })
    // In real app: await saveDocument({ id: existingDocument.id, title, content })
    alert("Document saved successfully!")
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true)
    } else {
      // In real app: router.back() or router.push('/folder')
      console.log("[v0] Navigating back")
    }
  }

  const handleDiscard = () => {
    setShowUnsavedDialog(false)
    // In real app: router.back() or router.push('/folder')
    console.log("[v0] Discarding changes and navigating back")
  }

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      const containerWidth = window.innerWidth
      const newLeftWidth = (e.clientX / containerWidth) * 100

      // Constrain between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftWidth(newLeftWidth)
      }
    },
    [isDragging],
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    setLeftWidth(50)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove])

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.querySelector("textarea")
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)

    setContent(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-white px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Unsaved changes" />}
          <span className="text-sm font-medium text-slate-700">
            {existingDocument.id ? `Edit: ${originalTitle}` : "New Document"}
          </span>
        </div>

        <Button onClick={handleSave} disabled={!canSave}>
          Save
        </Button>
      </div>

      {/* Title Input */}
      <div className="border-b bg-white px-6 py-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title..."
          className="text-xl font-semibold border-0 border-b border-transparent focus-visible:border-blue-600 focus-visible:ring-0 rounded-none px-0"
        />
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className="flex flex-col bg-white" style={{ width: `${leftWidth}%` }}>
          <EditorToolbar onInsertMarkdown={insertMarkdown} />
          <MarkdownEditor content={content} onChange={setContent} />
        </div>

        {/* Divider */}
        <div
          className="w-1 bg-slate-200 hover:bg-slate-300 cursor-col-resize transition-colors select-none"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        />

        {/* Preview Pane */}
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="border-b bg-white px-6 py-3">
            <span className="text-sm font-medium text-slate-700">Preview</span>
          </div>
          <EditorPreview content={content} />
        </div>
      </div>

      <UnsavedChangesDialog
        open={showUnsavedDialog}
        onCancel={() => setShowUnsavedDialog(false)}
        onDiscard={handleDiscard}
      />
    </div>
  )
}
