"use client"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bold, Italic, Code, Link, Heading } from "lucide-react"

interface EditorToolbarProps {
  onInsertMarkdown: (before: string, after?: string) => void
}

export function EditorToolbar({ onInsertMarkdown }: EditorToolbarProps) {
  return (
    <div className="border-b bg-white px-4 py-2 flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertMarkdown("**", "**")}
        title="Bold (Ctrl/Cmd + B)"
        className="h-8 w-8 p-0"
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertMarkdown("*", "*")}
        title="Italic (Ctrl/Cmd + I)"
        className="h-8 w-8 p-0"
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertMarkdown("`", "`")}
        title="Inline Code"
        className="h-8 w-8 p-0"
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onInsertMarkdown("[", "](url)")}
        title="Link"
        className="h-8 w-8 p-0"
      >
        <Link className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" title="Heading" className="h-8 w-8 p-0">
            <Heading className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onInsertMarkdown("# ", "")}>
            <span className="text-xl font-bold">Heading 1</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertMarkdown("## ", "")}>
            <span className="text-lg font-bold">Heading 2</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onInsertMarkdown("### ", "")}>
            <span className="text-base font-bold">Heading 3</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
