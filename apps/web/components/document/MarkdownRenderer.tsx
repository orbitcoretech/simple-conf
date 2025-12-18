"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="prose prose-slate prose-lg max-w-none">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "")
            const codeString = String(children).replace(/\n$/, "")

            return !inline && match ? (
              <div className="relative group my-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-700 hover:bg-slate-600 text-white z-10"
                  onClick={() => copyToClipboard(codeString)}
                >
                  {copiedCode === codeString ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <pre className="bg-slate-900 text-slate-50 rounded-lg p-6 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code className="bg-slate-100 text-slate-900 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          h1({ children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, "-")
            return (
              <h1 id={id} className="group relative" {...props}>
                {children}
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 no-underline"
                >
                  #
                </a>
              </h1>
            )
          },
          h2({ children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, "-")
            return (
              <h2 id={id} className="group relative" {...props}>
                {children}
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 no-underline"
                >
                  #
                </a>
              </h2>
            )
          },
          h3({ children, ...props }) {
            const id = String(children).toLowerCase().replace(/\s+/g, "-")
            return (
              <h3 id={id} className="group relative" {...props}>
                {children}
                <a
                  href={`#${id}`}
                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 no-underline"
                >
                  #
                </a>
              </h3>
            )
          },
          table({ children, ...props }) {
            return (
              <div className="overflow-x-auto">
                <table className="border-collapse border border-slate-300" {...props}>
                  {children}
                </table>
              </div>
            )
          },
          thead({ children, ...props }) {
            return (
              <thead className="bg-slate-50" {...props}>
                {children}
              </thead>
            )
          },
          tbody({ children, ...props }) {
            return (
              <tbody className="divide-y divide-slate-200" {...props}>
                {children}
              </tbody>
            )
          },
          tr({ children, ...props }) {
            return (
              <tr className="even:bg-slate-50" {...props}>
                {children}
              </tr>
            )
          },
          th({ children, ...props }) {
            return (
              <th className="border border-slate-300 px-4 py-2 text-left font-semibold" {...props}>
                {children}
              </th>
            )
          },
          td({ children, ...props }) {
            return (
              <td className="border border-slate-300 px-4 py-2" {...props}>
                {children}
              </td>
            )
          },
          a({ children, href, ...props }) {
            return (
              <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline-offset-2 hover:underline"
                {...props}
              >
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
