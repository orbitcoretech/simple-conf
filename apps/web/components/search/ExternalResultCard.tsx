import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface ExternalResultCardProps {
  result: {
    id: number
    title: string
    domain: string
    snippet: string
  }
}

export function ExternalResultCard({ result }: ExternalResultCardProps) {
  return (
    <Card className="p-4 border-dashed border-slate-300 hover:shadow-sm transition-shadow cursor-pointer hover:border-slate-400">
      {/* Title Row with External Link Icon */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold text-slate-900 hover:text-primary transition-colors">{result.title}</h3>
        <ExternalLink className="w-5 h-5 text-slate-400 shrink-0" />
      </div>

      {/* Domain */}
      <p className="text-sm text-slate-500 mb-2">{result.domain}</p>

      {/* Snippet */}
      <p className="text-slate-700 text-sm line-clamp-2">{result.snippet}</p>

      {/* Opens in new tab indicator */}
      <p className="text-xs text-slate-400 mt-2">Opens in new tab</p>
    </Card>
  )
}
