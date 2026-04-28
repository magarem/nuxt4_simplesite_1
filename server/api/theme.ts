import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(() => {
  const themePath = resolve(process.cwd(), 'app', 'config', 'theme.json')
  console.log("🚀 ~ themePath:", themePath)
  
  if (!existsSync(themePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Arquivo theme.json não encontrado em /config/'
    })
  }
  
  try {
    const content = readFileSync(themePath, 'utf-8')
    return JSON.parse(content)
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Erro ao ler theme.json: ${error.message}`
    })
  }
})