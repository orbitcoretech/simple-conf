import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Eye, Clock } from "lucide-react"

interface SearchResultCardProps {
  result: {
    id: number
    title: string
    path: string
    snippet: string
    relevance: number
    views: number
    updatedAt: string
  }
}

export function SearchResultCard({ result }: SearchResultCardProps) {
  const isHighRelevance = result.relevance > 0.8
  const isLowRelevance = result.relevance < 0.5

  return (
    <Card
      className={`p-4 border-slate-200 hover:shadow-sm transition-shadow cursor-pointer ${
        isLowRelevance ? "opacity-60" : ""
      }`}
    >
      {/* Title Row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-lg font-semibold text-slate-900 hover:text-primary transition-colors">{result.title}</h3>
        {isHighRelevance && (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 shrink-0">
            High match
          </Badge>
        )}
      </div>

      {/* Breadcrumb */}
      <p className="text-sm text-slate-500 mb-3">{result.path}</p>

      {/* Snippet with highlighted terms */}
      <div
        className="text-slate-700 mb-3 line-clamp-2 [&_mark]:bg-violet-100 [&_mark]:text-violet-800 [&_mark]:px-1 [&_mark]:rounded [&_mark]:font-normal"
        dangerouslySetInnerHTML={{ __html: result.snippet }}
      />

      {/* Footer Row */}
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1.5">
          <Eye className="w-4 h-4" />
          <span>{result.views} views</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>Updated {result.updatedAt}</span>
        </div>
      </div>
    </Card>
  )
}
