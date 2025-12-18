"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FolderBreadcrumbs } from "@/components/folder/Breadcrumbs"
import { DocumentList } from "@/components/folder/DocumentList"
import { DocumentPreview } from "@/components/folder/DocumentPreview"

// Mock data
const currentFolder = {
  id: "pg-001",
  name: "Payment Gateways",
  path: ["Home", "Sales", "Payment Gateways"],
  documentCount: 7,
  isAccessible: true,
}

const documents = [
  {
    id: 1,
    title: "Razorpay Integration Guide",
    updatedAt: "2 days ago",
    owner: "John Doe",
    views: 234,
    comments: 12,
    preview:
      "This guide covers the complete integration process for Razorpay payment gateway including API setup, webhook configuration, and testing procedures...",
  },
  {
    id: 2,
    title: "PhonePe Setup",
    updatedAt: "1 week ago",
    owner: "Jane Smith",
    views: 89,
    comments: 3,
    preview:
      "Step-by-step instructions for setting up PhonePe as a payment option in your application. Includes merchant account setup and SDK integration...",
  },
  {
    id: 3,
    title: "Stripe Configuration",
    updatedAt: "3 days ago",
    owner: "John Doe",
    views: 156,
    comments: 7,
    preview:
      "Complete guide to configuring Stripe payments with support for multiple currencies, subscription billing, and advanced fraud detection...",
  },
  {
    id: 4,
    title: "Payment Gateway Comparison",
    updatedAt: "2 weeks ago",
    owner: "Alex Chen",
    views: 67,
    comments: 5,
    preview:
      "Detailed comparison of various payment gateways including fees, features, supported countries, and integration complexity...",
  },
  {
    id: 5,
    title: "Refund Processing Guide",
    updatedAt: "5 days ago",
    owner: "Jane Smith",
    views: 45,
    comments: 2,
    preview:
      "Guidelines and procedures for handling refunds across different payment gateways with best practices for customer communication...",
  },
]

export default function FolderBrowsePage() {
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null)

  const selectedDoc = documents.find((doc) => doc.id === selectedDocId)
  const hasWriteAccess = true // Mock - would come from auth

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <FolderBreadcrumbs path={currentFolder.path} />

      {/* Folder Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{currentFolder.name}</h1>
          <span className="text-sm text-slate-500">({currentFolder.documentCount} documents)</span>
        </div>
        {hasWriteAccess && (
          <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] focus-visible:ring-2 focus-visible:ring-[#2563EB]">
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6">
        {/* Document List - 60% */}
        <div className={`${selectedDoc ? "w-[60%]" : "w-full"} transition-all duration-300`}>
          <DocumentList
            documents={documents}
            selectedId={selectedDocId}
            onSelect={setSelectedDocId}
            onOpen={(id) => console.log("[v0] Open document:", id)}
          />
        </div>

        {/* Preview Panel - 40% */}
        {selectedDoc && (
          <div className="w-[40%]">
            <DocumentPreview document={selectedDoc} onClose={() => setSelectedDocId(null)} />
          </div>
        )}
      </div>
    </div>
  )
}
