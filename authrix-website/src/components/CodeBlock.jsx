import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CodeBlock({ children, language = 'typescript' }) {
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-muted rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button
          onClick={copyCode}
          className="p-1 rounded hover:bg-background transition-colors"
        >
          {copied ? (
            <Check className="w-3 h-3 text-green-500" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="text-foreground">{children}</code>
      </pre>
    </div>
  )
}
