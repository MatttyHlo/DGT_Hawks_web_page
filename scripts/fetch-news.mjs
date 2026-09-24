// Saves the newest Facebook page posts to data/news.json for js/news.js.
// Usage: FB_PAGE_ID=... FB_PAGE_TOKEN=... node scripts/fetch-news.mjs
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';

const COUNT = 3;
const OUT_DIR = 'data';
const { FB_PAGE_ID, FB_PAGE_TOKEN } = process.env;

if (!FB_PAGE_ID || !FB_PAGE_TOKEN) {
  console.error('Set FB_PAGE_ID and FB_PAGE_TOKEN.');
  process.exit(1);
}

// Unversioned URL: uses the Meta app's default Graph API version, so it never hits a retired version.
const url = `https://graph.facebook.com/${encodeURIComponent(FB_PAGE_ID)}/posts`
  + `?fields=id,message,created_time,permalink_url,full_picture&limit=${COUNT}`
  + `&access_token=${encodeURIComponent(FB_PAGE_TOKEN)}`;

const res = await fetch(url);
const json = await res.json();
if (!res.ok || json.error) {
  console.error(`Facebook API error: ${json.error?.message || res.status}`);
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

// Facebook image URLs expire after a few days, so the photos are stored alongside the JSON.
const posts = [];
const keep = new Set(['news.json']);
for (const p of json.data) {
  // Facebook's "+0000" offset isn't parsed by Safari, so store standard ISO dates.
  const post = { created_time: new Date(p.created_time).toISOString(), message: p.message || '', permalink_url: p.permalink_url };
  if (p.full_picture) {
    const img = await fetch(p.full_picture);
    if (img.ok) {
      const file = `post-${p.id.replace(/[^\w-]/g, '_')}.jpg`;
      await writeFile(`${OUT_DIR}/${file}`, Buffer.from(await img.arrayBuffer()));
      post.full_picture = `${OUT_DIR}/${file}`;
      keep.add(file);
    }
  }
  posts.push(post);
}

for (const file of await readdir(OUT_DIR)) {
  if (file.startsWith('post-') && !keep.has(file)) await rm(`${OUT_DIR}/${file}`);
}

await writeFile(`${OUT_DIR}/news.json`, JSON.stringify({ data: posts }, null, 2) + '\n');
console.log(`Saved ${posts.length} posts.`);
