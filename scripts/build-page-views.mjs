import fs from 'fs';
import path from 'path';

const root = process.cwd();
const configPath = path.join(root, 'scripts', 'goatcounter-config.json');
const rawPath = path.join(root, 'scripts', 'goatcounter-raw.json');
const outPath = path.join(root, 'page-views.json');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));

const hits = Array.isArray(raw.hits) ? raw.hits : [];

function getCountByPath(targetPath) {
  const match = hits.find(h => h.path === targetPath);
  return match ? Number(match.count || 0) : 0;
}

const rawViews = {};
for (const page of config.pages) {
  rawViews[page.key] = {
    path: page.path,
    title: page.title,
    count: getCountByPath(page.path)
  };
}

const result = {
  updated_at: new Date().toISOString(),
  views: {
    home: {
      title: '医学影像前沿研究精选看板',
      count: (rawViews.home_root?.count || 0) + (rawViews.home_index?.count || 0),
      paths: [
        rawViews.home_root?.path,
        rawViews.home_index?.path
      ]
    },
    Chineseauthor: {
      title: rawViews.Chineseauthor?.title || '中国学者影像TOP杂志发表分析 - 往期归档',
      count: rawViews.Chineseauthor?.count || 0,
      paths: [rawViews.Chineseauthor?.path]
    },
    Radiology: {
      title: rawViews.Radiology?.title || 'Radiology 追踪专栏',
      count: rawViews.Radiology?.count || 0,
      paths: [rawViews.Radiology?.path]
    },
    hotspots: {
      title: rawViews.hotspots?.title || '前沿热点追踪',
      count: rawViews.hotspots?.count || 0,
      paths: [rawViews.hotspots?.path]
    },
    MedicalResearchSkills: {
      title: rawViews.MedicalResearchSkills?.title || '医学研究 AI 技能看板',
      count: rawViews.MedicalResearchSkills?.count || 0,
      paths: [rawViews.MedicalResearchSkills?.path]
    }
  },
  raw_views: rawViews
};

fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf8');
console.log(`Saved ${outPath}`);
