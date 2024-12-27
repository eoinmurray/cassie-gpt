import { remark } from 'remark';
import html from 'remark-html';

export default async function toMarkdown(content: string) {
  const mk = await remark().use(html).process(content)
  return mk.toString()
} 