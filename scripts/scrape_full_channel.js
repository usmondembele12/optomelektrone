const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => resolve(destPath));
      stream.on('error', reject);
    }).on('error', reject);
  });
}

async function scrapeAll() {
  let url = 'https://t.me/s/optomelektro';
  const allPosts = [];
  const seenIds = new Set();

  for (let page = 1; page <= 5; page++) {
    console.log(`Fetching page ${page}: ${url}...`);
    const html = await fetchUrl(url);

    // Split messages by tgme_widget_message_wrap
    const parts = html.split('<div class="tgme_widget_message_wrap');
    console.log(`Page ${page} has ${parts.length - 1} message wraps.`);

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      // Extract message id
      const idMatch = part.match(/data-post="optomelektro\/(\d+)"/);
      const postId = idMatch ? idMatch[1] : `p_${page}_${i}`;

      if (seenIds.has(postId)) continue;
      seenIds.add(postId);

      // Extract text
      const textMatch = part.match(/<div class="tgme_widget_message_text[^>]*>([\s\S]*?)<\/div>/);
      const rawText = textMatch ? textMatch[1] : '';
      const cleanText = rawText
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#33;/g, '!')
        .replace(/&apos;/g, "'")
        .trim();

      // Extract photo urls (background-image:url('...'))
      const photoRegex = /background-image:url\('([^']+)'\)/g;
      const photos = [];
      let pMatch;
      while ((pMatch = photoRegex.exec(part)) !== null) {
        if (pMatch[1].includes('telesco.pe')) {
          photos.push(pMatch[1]);
        }
      }

      if (cleanText || photos.length > 0) {
        allPosts.push({
          postId,
          text: cleanText,
          photos
        });
      }
    }

    // Check for "Load older posts" link: href="/s/optomelektro?before=..."
    const beforeMatch = html.match(/href="(\/s\/optomelektro\?before=\d+)"/);
    if (beforeMatch && page < 5) {
      url = 'https://t.me' + beforeMatch[1];
    } else {
      break;
    }
  }

  console.log(`Total unique posts collected: ${allPosts.length}`);
  fs.writeFileSync(path.join(__dirname, 'all_scraped_posts.json'), JSON.stringify(allPosts, null, 2), 'utf-8');
}

scrapeAll().catch(console.error);
