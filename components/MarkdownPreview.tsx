import { renderSimpleMarkdown } from '@/lib/simple-markdown'

type Props = {
  content: string | null | undefined
  className?: string
}

export default function MarkdownPreview({ content, className = '' }: Props) {
  const html = renderSimpleMarkdown(content)

  if (!html) {
    return <p className={className}>Sem descricao.</p>
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
