import { AppShell } from "@/components/layout/AppShell"
import { HeroSearch } from "@/components/home/HeroSearch"
import { RecentSearches } from "@/components/home/RecentSearches"
import { PopularDocuments } from "@/components/home/PopularDocuments"

export default function Home() {
  return (
    <AppShell>
      <div className="space-y-8">
        <HeroSearch />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentSearches />
          <PopularDocuments />
        </div>
      </div>
    </AppShell>
  )
}
