import fs from 'fs';
import path from 'path';

const root = process.cwd();
const configPath = path.join(root, 'scripts', 'goatcounter-config.json');
const rawPath = path.join(root, 'scripts', 'goatcounter-raw.json');
const outPath = path.join(root, 'page-views.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const hits = Array.isArray(raw.hits) ? raw.hits : [];

const result = {
  updated_at: new Date().toISOString(),
  views: {}
};

for (const page of config.pages) {
  const match = hits.find(h => h.path === page.path);
  result.views[page.key] = {
    path: page.path,
    title: page.title,
    count: match ? Number(match.count || 0) : 0
  };
}

fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Saved ${outPath}`);
