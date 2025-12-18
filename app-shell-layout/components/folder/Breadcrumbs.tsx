import { ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface FolderBreadcrumbsProps {
  path: string[]
}

export function FolderBreadcrumbs({ path }: FolderBreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {path.map((segment, index) => {
          const isLast = index === path.length - 1

          return (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold">{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href="#"
                    className="hover:text-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export { FolderBreadcrumbs as Breadcrumbs }
