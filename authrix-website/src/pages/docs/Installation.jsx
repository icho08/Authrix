import CodeBlock from '../../components/CodeBlock'

export default function Installation() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-4">Installation</h1>
        <p className="text-muted-foreground mb-6">
          Install Authrix SDK using your preferred package manager.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">npm</h3>
          <CodeBlock language="bash">npm install authrix-sdk</CodeBlock>
        </div>

        <div>
          <h3 className="font-medium mb-2">yarn</h3>
          <CodeBlock language="bash">yarn add authrix-sdk</CodeBlock>
        </div>

        <div>
          <h3 className="font-medium mb-2">bun</h3>
          <CodeBlock language="bash">bun add authrix-sdk</CodeBlock>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-medium mb-3">Requirements</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li>• React 18.0.0 or higher</li>
          <li>• Node.js 16.0.0 or higher</li>
          <li>• TypeScript support (optional but recommended)</li>
        </ul>
      </div>
    </div>
  )
}
