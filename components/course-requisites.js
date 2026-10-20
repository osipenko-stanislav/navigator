// Handbook tables sometimes split one requirement across several text blocks.
// Keep explicit alternatives together without treating a connector as a course.
export function normalizeRequisiteNames(names = []) {
  const result = []
  let joinNext = false
  let prefix = ''
  let alternatives = false
  let prefixJoinsPrevious = false

  for (const raw of names) {
    let text = String(raw)
      .replace(/\u200B/gu, '')
      .replace(/или(?=[🔴🔵🟢🟡🟠🟣⚫⚪])/gu, 'или ')
      .replace(/Phyton/g, 'Python')
      .replace(/([\p{L}\d])или(?=\s)/gu, '$1 или')
      .replace(/\s+/g, ' ')
      .trim()
    if (!text) continue
    if (/^или[,.]?$/iu.test(text)) {
      joinNext = true
      continue
    }
    const startsWithOr = /^или\s+/iu.test(text)
    text = text.replace(/^или\s+/iu, '')
    const endsWithOr = /(?:,?\s+или|,?или)$/iu.test(text)
    text = text.replace(/(?:,?\s+или|,?или)$/iu, '').replace(/[,;]+$/, '').trim()

    if (text.endsWith(':')) {
      prefix = text
      alternatives = /один из курсов/iu.test(text)
      prefixJoinsPrevious = startsWithOr || joinNext
      joinNext = false
      continue
    }
    if (/^Для потока\s/iu.test(text)) alternatives = false
    const joinsPrevious = startsWithOr || joinNext || prefixJoinsPrevious
    const value = prefix ? `${prefix} ${text}` : text
    if ((joinsPrevious || (alternatives && !prefix)) && result.length) {
      result[result.length - 1] += ` или ${value}`
    } else result.push(value)
    prefix = ''
    prefixJoinsPrevious = false
    joinNext = endsWithOr
  }
  // Preserve an unmatched explanatory heading rather than dropping source content.
  if (prefix) result.push(prefix)
  return [...new Set(result)]
}

export function requisiteIsSatisfied(ids, name, eligibleIds) {
  if (!ids.length) return true
  return /\sили\s/iu.test(name)
    ? ids.some((id) => eligibleIds.has(id))
    : ids.every((id) => eligibleIds.has(id))
}
