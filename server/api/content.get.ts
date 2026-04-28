import path from 'node:path'
import matter from 'gray-matter'
import yaml from 'js-yaml'

function getNestedProperty(obj: any, path: string) {
  if (!path) return obj;
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const cleanRoute = (query.path as string || '').replace(/^\/+|\/+$/g, '').replace(/\.\./g, '')
  const nodePath = query.node as string 

  // ✨ SISTEMA DE PREVIEW POR COOKIE
  let previewVersion = (query.version as string) || getCookie(event, 'preview_layer');

  // Se o URL pedir para limpar (?version=clear), apagamos o cookie
  if (query.version === 'clear') {
    deleteCookie(event, 'preview_layer');
    previewVersion = undefined;
  } else if (query.version) {
    // Se trouxer uma versão válida, guardamos no Cookie (dura 1 hora)
    setCookie(event, 'preview_layer', query.version as string, { path: '/', maxAge: 3600 });
  }

  console.log(`🚨 [LIVE CONTENT] A ler /${cleanRoute || 'raiz'} | Camada Forçada: ${previewVersion || 'Nenhuma'}`)
  
  let fileInfo = null;
  let fileExtension = '.json';

  // 🧠 MOTOR INTELIGENTE (Agora com suporte a YAML)
  if (cleanRoute.endsWith('.json')) {
      fileInfo = await resolveFileInLayers(cleanRoute, previewVersion);
      fileExtension = '.json';
  } else if (cleanRoute.endsWith('.yml')) {
      fileInfo = await resolveFileInLayers(cleanRoute, previewVersion);
      fileExtension = '.yml';
  } else if (cleanRoute.endsWith('.md')) {
      fileInfo = await resolveFileInLayers(cleanRoute, previewVersion);
      fileExtension = '.md';
  }

  // 1. Fallbacks para JSON
  if (!fileInfo && cleanRoute) {
      fileInfo = await resolveFileInLayers(`${cleanRoute}.json`, previewVersion);
      if (fileInfo) fileExtension = '.json';
  }
  if (!fileInfo) {
      fileInfo = await resolveFileInLayers(cleanRoute ? `${cleanRoute}/_index.json` : '_index.json', previewVersion);
      if (fileInfo) fileExtension = '.json';
  }

  // 2. Fallbacks para YAML (✨ A MAGIA QUE FALTAVA)
  if (!fileInfo && cleanRoute) {
      fileInfo = await resolveFileInLayers(`${cleanRoute}.yml`, previewVersion);
      if (fileInfo) fileExtension = '.yml';
  }
  if (!fileInfo) {
      fileInfo = await resolveFileInLayers(cleanRoute ? `${cleanRoute}/_index.yml` : '_index.yml', previewVersion);
      if (fileInfo) fileExtension = '.yml';
  }

  // 3. Fallbacks para Markdown
  if (!fileInfo && cleanRoute) {
      fileInfo = await resolveFileInLayers(`${cleanRoute}.md`, previewVersion);
      if (fileInfo) fileExtension = '.md';
  }
  if (!fileInfo) {
      fileInfo = await resolveFileInLayers(cleanRoute ? `${cleanRoute}/_index.md` : '_index.md', previewVersion);
      if (fileInfo) fileExtension = '.md';
  }

  if (!fileInfo) throw createError({ statusCode: 404, statusMessage: `Conteúdo não encontrado para: ${cleanRoute}` })
  if (fileInfo.error === 'deleted_tombstone') throw createError({ statusCode: 404, statusMessage: 'Conteúdo oculto na versão atual.' })
  try {
    const fileContent = fileInfo.content;
    const timestamp = new Date().toISOString()
    let result: any = {}

    if (fileExtension === '.json') {
      result = { type: 'json', raw: fileContent, data: JSON.parse(fileContent), fetchedAt: timestamp, _layer: fileInfo.versionSource }
    } else if (fileExtension === '.yml' || fileExtension === '.yaml') {
      result = { type: 'yaml', raw: fileContent, data: yaml.load(fileContent), fetchedAt: timestamp, _layer: fileInfo.versionSource }
    } else {
      const parse = typeof matter === 'function' ? matter : (matter as any).default
      const { data: md_data, content: md_content } = parse(fileContent)
      result = { type: 'markdown', raw: fileContent, md_data, md_content, fetchedAt: timestamp, _layer: fileInfo.versionSource }
    }

    if (nodePath) {
      const extractedNode = getNestedProperty(result, nodePath)
      if (extractedNode === undefined) throw createError({ statusCode: 404 })
      return extractedNode
    }

    return result
  } catch (error: any) {
    if (error.statusCode) throw error;
    throw createError({ statusCode: 500, statusMessage: `Erro interno: ${error.message}` })
  }
})