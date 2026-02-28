const path = require('path');
const fs = require('fs').promises;
const moment = require('moment');

const BLOG_DIRECTORY = 'src/blog';
const RSS_OUTPUT_FILE = 'public/rss.xml';
const SITEMAP_OUTPUT_FILE = 'public/sitemap.xml';
const SITE_URL = 'https://ad-absurdum.me';
const SITE_TITLE = 'ad-absurdum.me';
const SITE_DESCRIPTION = 'So many ideas so little time';

// Read a blog post and extract description
const extractDescription = async (slug) => {
  try {
    const mdxFiles = await fs.readdir(path.join(BLOG_DIRECTORY, slug));
    const mdxFile = mdxFiles.find((file) => file.endsWith('.mdx'));

    if (!mdxFile) return '';

    const fullPath = path.join(BLOG_DIRECTORY, slug, mdxFile);
    const contents = (await fs.readFile(fullPath)).toString();
    const lines = contents.split('\n');

    // Find the first substantial paragraph after the date tag
    const dateIndex = lines.findIndex((line) => line.includes('<date>'));
    const linesAfterDate = dateIndex >= 0 ? lines.slice(dateIndex + 1) : lines;

    const cleanLine = (line) => line
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links
      .replace(/<[^>]+>/g, '') // Remove HTML/JSX tags
      .replace(/\{[^}]+\}/g, '') // Remove JSX expressions
      .trim();

    let description = '';
    for (const line of linesAfterDate) {
      const trimmed = line.trim();
      if (trimmed.length > 50 && !line.startsWith('#') && !line.startsWith('import') && !trimmed.startsWith('*')) {
        const cleaned = cleanLine(line);
        if (cleaned.length > 50) {
          description = cleaned.length > 300 ? `${cleaned.substring(0, 297)}...` : cleaned;
          break;
        }
      }
    }

    return description || 'Read more on ad-absurdum.me';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error extracting description for ${slug}:`, error.message);
    return '';
  }
};

// Escape XML special characters
const escapeXml = (text) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

// Parse date string to RFC 822 format (required by RSS)
const toRFC822 = (dateString) => {
  const date = moment(dateString, 'DD MMM YYYY');
  return date.format('ddd, DD MMM YYYY HH:mm:ss ZZ');
};

// Parse date string to W3C format (required by Sitemap)
const toW3C = (dateString) => {
  const date = moment(dateString, 'DD MMM YYYY');
  return date.format('YYYY-MM-DD');
};

// Generate RSS item for a blog post
const generateRssItem = async (post) => {
  const link = `${SITE_URL}/blog/${post.slug}`;
  const description = await extractDescription(post.slug);
  const pubDate = toRFC822(post.date);

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
    </item>`;
};

// Generate complete RSS feed
const generateRssFeed = async (posts) => {
  const items = await Promise.all(posts.map(generateRssItem));
  const buildDate = moment().format('ddd, DD MMM YYYY HH:mm:ss ZZ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <ttl>1440</ttl>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;
};

// Generate sitemap URL entry for a blog post
const generateSitemapUrl = (post) => {
  const link = `${SITE_URL}/blog/${post.slug}`;
  const lastmod = toW3C(post.date);

  return `  <url>
    <loc>${link}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
};

// Generate complete sitemap
const generateSitemap = (posts) => {
  const blogUrls = posts.map(generateSitemapUrl).join('\n');
  // Homepage updates when a new blog post is published
  const latestPostDate = posts.length > 0 ? toW3C(posts[0].date) : moment().format('YYYY-MM-DD');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${latestPostDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
${blogUrls}
</urlset>`;
};

// Main function
const main = async () => {
  try {
    // Import the blog registry
    const blogRegistryPath = path.join(__dirname, '..', 'src/components/BlogShell/blog-registry.js');

    // Read and parse the registry file to extract blog posts
    const registryContent = await fs.readFile(blogRegistryPath, 'utf-8');

    // Extract blog posts from the registry (parse the JavaScript array)
    const blogRegistryMatch = registryContent.match(/export const blogRegistry = \[([\s\S]*?)\];/);
    if (!blogRegistryMatch) {
      throw new Error('Could not parse blog registry');
    }

    // Parse blog posts manually from the registry
    const postMatches = registryContent.matchAll(/\{\s*slug:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)',\s*component:[^,]+,\s*date:\s*'([^']+)',?\s*\}/g);

    const posts = Array.from(postMatches).map((match) => ({
      slug: match[1],
      title: match[2].replace(/\\'/g, "'"), // Unescape single quotes
      date: match[3],
    }));

    // eslint-disable-next-line no-console
    console.log(`Found ${posts.length} blog posts`);

    // Generate RSS feed
    const rssFeed = await generateRssFeed(posts);
    await fs.writeFile(RSS_OUTPUT_FILE, rssFeed, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`✅ RSS feed generated at ${RSS_OUTPUT_FILE}`);

    // Generate sitemap
    const sitemap = generateSitemap(posts);
    await fs.writeFile(SITEMAP_OUTPUT_FILE, sitemap, 'utf-8');
    // eslint-disable-next-line no-console
    console.log(`✅ Sitemap generated at ${SITEMAP_OUTPUT_FILE}`);

    // eslint-disable-next-line no-console
    console.log(`\n📡 RSS: ${SITE_URL}/rss.xml`);
    // eslint-disable-next-line no-console
    console.log(`🗺️  Sitemap: ${SITE_URL}/sitemap.xml`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating feeds:', error);
    process.exit(1);
  }
};

main();
