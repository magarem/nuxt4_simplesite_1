import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const fileName = query.path as string

  // Validação básica do parâmetro
  if (!fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'O parâmetro "path" é obrigatório (ex: about.md)',
    })
  }

  try {
    // 1. Localizamos o ficheiro na pasta public/data
    const filePath = path.join(process.cwd(), 'public/data', fileName)
    
    // 2. Lemos o conteúdo bruto (raw string)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    
    // 3. ✨ PARSE DO FRONTMATTER NO SERVIDOR ✨
    // O gray-matter funciona perfeitamente aqui porque estamos em ambiente Node.js.
    const { data: md_data, content: md_content } = matter(fileContent)
    
    // 4. Retornamos os dados estruturados
    return {
      raw: fileContent, // O conteúdo bruto do ficheiro Markdown
      md_data,    // Objeto com title, author, topimage, etc.
      md_content, // String apenas com o corpo do Markdown limpo
      fetchedAt: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Erro ao ler ou processar Markdown:', error.message)
    
    throw createError({
      statusCode: 404,
      statusMessage: `Ficheiro não encontrado ou erro de processamento: ${fileName}`,
    })
  }
})