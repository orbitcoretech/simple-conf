import { Clock, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentSearches = [
  "razorpay integration",
  "e-commerce checkout flow",
  "API authentication",
  "deployment process",
  "code review guidelines",
]

export function RecentSearches() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="h-5 w-5 text-slate-500" />
          Recent Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentSearches.length > 0 ? (
          <div className="space-y-2">
            {recentSearches.map((query, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 rounded-md px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors duration-150 group"
              >
                <span className="text-sm text-slate-700">{query}</span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove search">
                  <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center py-8">No recent searches</p>
        )}
      </CardContent>
    </Card>
  )
}
