import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';

// 🧠 NOVO: Motor de Leitura Universal para a Árvore
function parseFileContent(content: string, extension: string) {
  try {
    if (extension === '.json') return JSON.parse(content);
    if (extension === '.yml' || extension === '.yaml') return yaml.load(content) || {};
    if (extension === '.md') {
      const parse = typeof matter === 'function' ? matter : (matter as any).default;
      return parse(content).data || {}; // No MD, a árvore só precisa dos metadados (frontmatter)
    }
  } catch(e) {
    console.error(`🚨 Erro ao analisar conteúdo ${extension}:`, e);
  }
  return {};
}

// ✨ getSingleNode agora suporta JSON, YML e MD
async function getSingleNode(nodeRoute: string, previewLayer?: string) {
  if (!nodeRoute) return { error: 'Root' };

  let fileInfo = null;
  let ext = '.json';

  // 1. Tenta ficheiros diretos
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}.json`, previewLayer); ext = '.json'; }
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}.yml`, previewLayer); ext = '.yml'; }
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}.md`, previewLayer); ext = '.md'; }

  // 2. Tenta ficheiros Index (Pastas)
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}/_index.json`, previewLayer); ext = '.json'; }
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}/_index.yml`, previewLayer); ext = '.yml'; }
  if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodeRoute}/_index.md`, previewLayer); ext = '.md'; }

  if (fileInfo) {
    if (fileInfo.error === 'deleted_tombstone') return { error: 'Not found' };
    
    const data: any = parseFileContent(fileInfo.content, ext);
    const { blocks, ...metadata } = data;
    
    return {
      title: metadata.title || metadata.meta?.title || path.basename(nodeRoute),
      description: metadata.description || metadata.meta?.description || '',
      image: metadata.image || metadata.meta?.image || null,
      path: `/${nodeRoute}`,
      type: 'page',
      metadata: metadata,
      blocks: blocks || [],
      _layer: fileInfo.versionSource
    };
  }
  return { error: 'Not found' };
}

async function buildTree(currentRoutePath: string, previewLayer?: string): Promise<any[]> {
  let childrenList: any[] = [];
  const versions = await getActiveVersions(previewLayer);
  
  // Guardamos apenas o SLUG (sem extensão) para fundir perfeitamente JSON/YML da v1 e v2
  const uniqueEntries = new Map<string, { isDir: boolean, name: string }>();
  const reversedVersions = [...versions].reverse();

  for (const version of reversedVersions) {
    const dirPath = path.join(process.cwd(), 'data', version, currentRoutePath);
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith('_')) continue; 
        
        let keyName = entry.name;
        let isDir = entry.isDirectory();
        
        // Remove a extensão para agrupar ficheiros iguais (ex: about.json e about.yml viram 'about')
        if (!isDir) {
           const fileExt = path.extname(entry.name);
           if (['.json', '.yml', '.yaml', '.md'].includes(fileExt)) {
             keyName = entry.name.replace(fileExt, '');
           } else {
             continue; // Ignora ficheiros que não sejam de conteúdo
           }
        }
        
        uniqueEntries.set(keyName, { isDir, name: keyName });
      }
    } catch (e) {} // Continua se a pasta não existir nesta camada
  }

  for (const [slug, entry] of uniqueEntries.entries()) {
    const nodePath = currentRoutePath ? `${currentRoutePath}/${slug}` : slug;

    if (entry.isDir) {
       let idxInfo = null;
       let ext = '.json';
       
       if (!idxInfo) { idxInfo = await resolveFileInLayers(`${nodePath}/_index.json`, previewLayer); ext = '.json'; }
       if (!idxInfo) { idxInfo = await resolveFileInLayers(`${nodePath}/_index.yml`, previewLayer); ext = '.yml'; }
       if (!idxInfo) { idxInfo = await resolveFileInLayers(`${nodePath}/_index.md`, previewLayer); ext = '.md'; }

       if (idxInfo && idxInfo.error === 'deleted_tombstone') continue;

       let folderMeta: any = {};
       let folderTitle = slug.charAt(0).toUpperCase() + slug.slice(1);
       let layer = null;

       if (idxInfo && !idxInfo.error) {
         const data: any = parseFileContent(idxInfo.content, ext);
         const { blocks, ...meta } = data;
         folderMeta = meta;
         folderTitle = meta.title || meta.meta?.title || folderTitle;
         layer = idxInfo.versionSource;
       }

       childrenList.push({
         title: folderTitle,
         path: `/${nodePath}`,
         type: 'folder',
         metadata: folderMeta,
         _layer: layer,
         children: await buildTree(nodePath, previewLayer) // Passar para os filhos
       });

    } else {
       // Se for um Ficheiro
       let fileInfo = null;
       let ext = '.json';
       
       if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodePath}.json`, previewLayer); ext = '.json'; }
       if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodePath}.yml`, previewLayer); ext = '.yml'; }
       if (!fileInfo) { fileInfo = await resolveFileInLayers(`${nodePath}.md`, previewLayer); ext = '.md'; }

       if (fileInfo && fileInfo.error === 'deleted_tombstone') continue;

       if (fileInfo && !fileInfo.error) {
         const data: any = parseFileContent(fileInfo.content, ext);
         const { blocks, ...pageMetadata } = data;
         
         childrenList.push({
           title: pageMetadata.title || pageMetadata.meta?.title || slug,
           path: `/${nodePath}`,
           type: 'page',
           metadata: pageMetadata,
           _layer: fileInfo.versionSource,
           children: []
         });
       }
    }
  }

  // ==========================================
  // ✨ LER O FICHEIRO CENTRAL DE ORDEM DA PASTA
  // ==========================================
  let orderList: string[] = [];
  
  // Tenta procurar o _order.yml ou _order.json na pasta atual
  let orderInfo = await resolveFileInLayers(currentRoutePath ? `${currentRoutePath}/_order.yml` : '_order.yml', previewLayer);
  let orderExt = '.yml';

  if (!orderInfo) {
    orderInfo = await resolveFileInLayers(currentRoutePath ? `${currentRoutePath}/_order.json` : '_order.json', previewLayer);
    orderExt = '.json';
  }

  // Se encontrou o ficheiro mestre, extrai a lista
  if (orderInfo && !orderInfo.error) {
    const parsedOrder = parseFileContent(orderInfo.content, orderExt);
    orderList = Array.isArray(parsedOrder.order) ? parsedOrder.order : [];
  }

  // ==========================================
  // 🔄 ORDENAÇÃO DE ALTA PRECISÃO
  // ==========================================
  return childrenList.sort((a, b) => {
    // Extrai o nome limpo do caminho (ex: /services/seguranca -> seguranca)
    const slugA = path.basename(a.path);
    const slugB = path.basename(b.path);

    // 1. Tenta encontrar a ordem na lista centralizada (_order.yml)
    let orderA = orderList.indexOf(slugA);
    let orderB = orderList.indexOf(slugB);

    // Se o ficheiro não estiver na lista central, damos-lhe o valor 999 (vai para o fim)
    if (orderA === -1) orderA = 999;
    if (orderB === -1) orderB = 999;

    // 2. Fallback: Se não estiver no _order.yml, verifica se o próprio ficheiro tem "order" nos metadados
    if (orderA === 999 && a.metadata?.order !== undefined) orderA = Number(a.metadata.order);
    if (orderB === 999 && b.metadata?.order !== undefined) orderB = Number(b.metadata.order);

    // 3. Aplica a ordenação matemática
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    // 4. Último Recurso: Ordem Alfabética (se não tiverem números)
    const isAPage = a.type === 'page' || a.type === 'folder';
    const isBPage = b.type === 'page' || b.type === 'folder';
    if (isAPage && !isBPage) return -1; 
    if (!isAPage && isBPage) return 1;  
    
    return a.title.localeCompare(b.title); 
  });
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const targetPath = (query.path as string || '').replace(/^\/+|\/+$/g, '').replace(/\.\./g, '');
  const targetProp = (query.node as string) || (query.prop as string);

  let previewVersion = (query.version as string) || getCookie(event, 'preview_layer');

  if (query.version === 'clear') {
    deleteCookie(event, 'preview_layer');
    previewVersion = undefined;
  } else if (query.version) {
    setCookie(event, 'preview_layer', query.version as string, { path: '/', maxAge: 3600 });
  }

  console.log(`✨ [LIVE TREE] Árvore para: ${targetPath || 'raiz'} | Camada Forçada: ${previewVersion || 'Nenhuma'}`);

  const limit = parseInt(query.limit as string);
  const page = parseInt(query.page as string) || 1;

  if (targetProp) {
    const nodeData = await getSingleNode(targetPath, previewVersion);
    if (!nodeData.error) {
      const getDeepValue = (obj: any, pathStr: string) => {
        const normalizedPath = pathStr.replace(/\//g, '.').replace(/\[['"]?(\w+)['"]?\]/g, '.$1').replace(/^\./, '');
        return normalizedPath.split('.').reduce((acc, key) => (acc !== undefined && acc !== null) ? acc[key] : undefined, obj);
      };

      let extractedValue = getDeepValue(nodeData, targetProp);
      if (extractedValue === undefined && nodeData.metadata) extractedValue = getDeepValue(nodeData.metadata, targetProp);

      if (extractedValue !== undefined) {
        if (Array.isArray(extractedValue) && !isNaN(limit) && limit > 0) return extractedValue.slice((page - 1) * limit, page * limit);
        return extractedValue;
      }
      return null;
    }
  }

  const childrenList = await buildTree(targetPath, previewVersion);
  const parentNode = await getSingleNode(targetPath, previewVersion);

  if (targetPath === '') {
    const rootData = parentNode.error ? {} : parentNode;
    return { title: 'Bellinzoni', path: '/', type: 'folder', ...rootData, children: childrenList };
  }

  if (!parentNode.error) {
    const resultNode = { ...parentNode, children: childrenList };
    if (!isNaN(limit) && limit > 0) resultNode.children = childrenList.slice((page - 1) * limit, page * limit);
    return resultNode;
  }

  if (childrenList.length > 0) {
    return { title: path.basename(targetPath).charAt(0).toUpperCase() + path.basename(targetPath).slice(1), path: `/${targetPath}`, type: 'folder', metadata: {}, children: childrenList };
  }

  throw createError({ statusCode: 404, statusMessage: 'Pasta não encontrada' });
});