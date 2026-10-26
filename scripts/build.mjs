import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../',import.meta.url);
mkdirSync(new URL('lib/',root),{recursive:true});
const result = await build({entryPoints:[fileURLToPath(new URL('src/client.js',root))],bundle:true,write:false,
  format:'cjs',minify:true,target:'es2022',external:['react'],loader:{'.jpg':'dataurl'},legalComments:'inline'});
const licenses = ['LICENSE','licenses/webgpu-black-hole-MIT.txt','licenses/three-MIT.txt'].map(f=>readFileSync(new URL(f,root),'utf8')).join('\n\n');
// React 由 DSH 提供，其余渲染依赖与静帧全部内嵌，不从 CDN 加载。
const output = '/*!\n'+licenses+'\n*/\nwindow.__ModuleLoader__.load({id:"dsh-gargantua",factory(require){const module={exports:{}};const exports=module.exports;\n'
  +result.outputFiles[0].text+'\nreturn module.exports;}});\n';
writeFileSync(new URL('lib/client.js',root),output);
console.log('DSH Gargantua: lib/client.js');
