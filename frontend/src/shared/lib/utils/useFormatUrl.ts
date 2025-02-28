/**
 * Formats a GitHub URL into a markdown link with the desired text:
 * - For pull requests: [#number](URL)
 * - For compare: [part1...part2](URL)
 */
const formatGitHubUrl = (url: string): string => {
  // Handle pull request URLs (only digits)
  const pullMatch = url.match(/\/pull\/(\d+)/)
  if (pullMatch) {
    return `[#${pullMatch[1]}](${url})`
  }

  // Handle compare URLs:
  // This regular expression captures any sequence of characters (except '/')
  // before and after the literal "..." so that it works with versions like
  // "1.0.0-rc...2.0.0-rc" or even "rc...1.2.0-rc".
  const compareMatch = url.match(/\/compare\/([^\/]+)\.\.\.([^\/]+)/)
  if (compareMatch) {
    return `[${compareMatch[1]}...${compareMatch[2]}](${url})`
  }

  // If the URL does not match any pattern, return a markdown link with the URL as the text.
  return `[${url}](${url})`
}

/**
 * Replaces all GitHub pull/compare links in a markdown text with markdown links
 * that have the formatted text.
 * The function handles both markdown-formatted links and raw URLs.
 */
const replaceGitHubLinksInMarkdown = (markdown: string): string => {
  // First, replace links that are already in markdown format: [text](URL)
  markdown = markdown.replace(
    /\[([^\]]+)\]\((https:\/\/github\.com\/[^\/]+\/[^\/]+\/(?:pull\/\d+|compare\/[^\/]+\.\.\.[^\/]+))\)/g,
    (_match, _text, url) => {
      return formatGitHubUrl(url)
    }
  )

  // Then, replace raw URLs (not wrapped in markdown) using negative lookbehind
  // to avoid altering already processed links.
  markdown = markdown.replace(
    /(?<!\]\()https:\/\/github\.com\/[^\/]+\/[^\/]+\/(?:pull\/\d+|compare\/[^\/]+\.\.\.[^\/]+)/g,
    (url) => formatGitHubUrl(url)
  )

  return markdown
}

export { formatGitHubUrl, replaceGitHubLinksInMarkdown }
