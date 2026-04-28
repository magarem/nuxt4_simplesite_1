import { promises as fs } from 'node:fs';
import path from 'node:path';

/**
 * 1. Lê o ficheiro de configurações. Se houver previewLayer, injeta-o no topo!
 */
export async function getActiveVersions(previewLayer?: string): Promise<string[]> {
  try {
    const settingsPath = path.join(process.cwd(), 'data', '_settings.json');
    const content = await fs.readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(content);
    
    let versions = settings.activeVersions && Array.isArray(settings.activeVersions) 
      ? settings.activeVersions 
      : ['v1'];

    // ✨ A MAGIA DO PREVIEW: Se pedirmos uma camada de teste, ela ganha prioridade máxima!
    if (previewLayer && previewLayer !== 'clear') {
      // Coloca o preview em primeiro lugar, e remove-o da lista original caso já lá estivesse
      versions = [previewLayer, ...versions.filter(v => v !== previewLayer)];
    }

    return versions;
  } catch (error) {
    return previewLayer && previewLayer !== 'clear' ? [previewLayer, 'v1'] : ['v1'];
  }
}

/**
 * 2. O Buscador recebe a ordem de qual é a camada de preview
 */
export async function resolveFileInLayers(relativePath: string, previewLayer?: string) {
  // Passamos o previewLayer para a função de cima
  const versions = await getActiveVersions(previewLayer);
  
  for (const version of versions) {
    const fullPath = path.join(process.cwd(), 'data', version, relativePath);
    
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      
      if (relativePath.endsWith('.json')) {
        const parsed = JSON.parse(content);
        if (parsed._deleted) return { error: 'deleted_tombstone' }; 
      }

      return { content, versionSource: version, fullPath };
    } catch (e: any) {
      if (e.code !== 'ENOENT') {
        console.error(`🚨 ERRO CRÍTICO no ficheiro ${fullPath}:`, e.message);
      }
      continue;
    }
  }

  return null;
}