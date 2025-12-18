import { TrendingUp, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const popularDocs = [
  { id: 1, title: "Razorpay Integration Guide", path: "Sales > Payment Gateways", views: 234 },
  { id: 2, title: "E-commerce PRD v2", path: "Product > E-commerce", views: 187 },
  { id: 3, title: "API Authentication Standards", path: "Engineering > Backend", views: 156 },
  { id: 4, title: "Onboarding Checklist", path: "HR > New Hires", views: 142 },
  { id: 5, title: "Code Review Best Practices", path: "Engineering > Standards", views: 128 },
]

export function PopularDocuments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-slate-500" />
          Popular This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {popularDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-md border border-slate-100 p-3 hover:bg-slate-50 cursor-pointer transition-all duration-150"
            >
              <h3 className="font-medium text-slate-800 mb-1">{doc.title}</h3>
              <p className="text-sm text-slate-500 mb-2">{doc.path}</p>
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <Eye className="h-4 w-4" />
                <span>{doc.views}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
