import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// 只有显式同步才读取源项目；平时构建完全使用仓库内固定快照。
const sourceArg = process.argv[2];
if (!sourceArg) throw new Error('Usage: npm run sync:engine -- <gargantua-directory>');
const source = resolve(sourceArg);
const root = fileURLToPath(new URL('../',import.meta.url));
const target = join(root,'vendor/gargantua');
const pkg = JSON.parse(readFileSync(join(source,'package.json'),'utf8'));
if(pkg.name!=='gargantua-animation')throw new Error('Not a Gargantua source project');
const files=['src/core.js','src/config.js','src/blackhole.js','src/blackhole-shader.js',
  'assets/desktop.jpg','assets/tablet.jpg','assets/mobile.jpg','LICENSE','licenses/webgpu-black-hole-MIT.txt','licenses/three-MIT.txt'];
const hashes={};
for(const file of files){const dest=join(target,file);mkdirSync(resolve(dest,'..'),{recursive:true});copyFileSync(join(source,file),dest);hashes[file]=createHash('sha256').update(readFileSync(dest)).digest('hex');}
writeFileSync(join(target,'snapshot.json'),JSON.stringify({name:pkg.name,version:pkg.version,files:hashes},null,2)+'\n');
console.log('Synced Gargantua '+pkg.version+' ('+files.length+' files)');
