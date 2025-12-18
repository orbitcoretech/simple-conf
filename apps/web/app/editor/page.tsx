"use client"

import { Suspense } from "react"
import { DocumentEditorPage } from "@/components/editor/DocumentEditorPage"

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading editor...</div>}>
      <DocumentEditorPage />
    </Suspense>
  )
}
