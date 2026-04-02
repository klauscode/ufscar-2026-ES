function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function renderInline(text: string) {
  let html = escapeHtml(text)

  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

  return html
}

export function renderSimpleMarkdown(source: string | null | undefined) {
  if (!source?.trim()) {
    return ''
  }

  const lines = source.replace(/\r\n/g, '\n').trim().split('\n')
  const output: string[] = []
  let inUnorderedList = false
  let inOrderedList = false

  function closeLists() {
    if (inUnorderedList) {
      output.push('</ul>')
      inUnorderedList = false
    }
    if (inOrderedList) {
      output.push('</ol>')
      inOrderedList = false
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (!line) {
      closeLists()
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      closeLists()
      const level = heading[1].length
      output.push(`<h${level}>${renderInline(heading[2])}</h${level}>`)
      continue
    }

    const unordered = line.match(/^[-*]\s+(.*)$/)
    if (unordered) {
      if (inOrderedList) {
        output.push('</ol>')
        inOrderedList = false
      }
      if (!inUnorderedList) {
        output.push('<ul>')
        inUnorderedList = true
      }
      output.push(`<li>${renderInline(unordered[1])}</li>`)
      continue
    }

    const ordered = line.match(/^\d+\.\s+(.*)$/)
    if (ordered) {
      if (inUnorderedList) {
        output.push('</ul>')
        inUnorderedList = false
      }
      if (!inOrderedList) {
        output.push('<ol>')
        inOrderedList = true
      }
      output.push(`<li>${renderInline(ordered[1])}</li>`)
      continue
    }

    closeLists()
    output.push(`<p>${renderInline(line)}</p>`)
  }

  closeLists()
  return output.join('')
}
