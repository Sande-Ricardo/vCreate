export const latexEscapes: Record<string, string> = {
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '\\': '\\textbackslash{}',
  // Common typographic characters that break pdflatex
  '·': '\\textperiodcentered{}',
  '—': '---',
  '–': '--',
  '“': '``',
  '”': "\'\'",
  '‘': '`',
  '’': "\'",
  '…': '\\dots{}',
};

/**
 * Escapes special LaTeX characters in a string to prevent compilation errors.
 */
export function sanitizeLatex(text: string | null | undefined): string {
  if (!text) return '';
  // Match any of the special characters and replace using the map
  return text.replace(/[&%$#_{}~^\\·—–“”‘’…]/g, (match) => latexEscapes[match]);
}
