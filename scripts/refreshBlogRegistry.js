const path = require('path');

const fs = require('fs').promises;
const moment = require('moment');

const BLOG_DIRECTORY = 'src/blog';
const BLOG_REGISTRY_FILE = 'src/components/BlogShell/blog-registry.js';

const validateEntry = (entry) => {
  if (!entry.slug) throw Error(`${entry.fileName} slug is empty`);
  if (!entry.title) throw Error(`${entry.fileName} title is empty`);
  if (!entry.date || Number.isNaN(entry.date)) throw Error(`${entry.fileName} date is empty or invalid`);
  return entry;
};

const fileNameToItem = async (fileName) => {
  const slug = fileName.split('.mdx')[0];
  const fullPath = path.join(BLOG_DIRECTORY, fileName);
  const contents = (await fs.readFile(fullPath)).toString();
  const lines = contents.split('\n');

  const title = lines[0].split('# ')[1];
  const date = Date.parse(lines[2]);

  const blogRegistryDir = path.parse(BLOG_REGISTRY_FILE).dir;
  const relativeDir = path.posix.relative(blogRegistryDir, BLOG_DIRECTORY);
  const component = path.posix.join(relativeDir, fileName);

  return {
    slug,
    title,
    component,
    date,
    fileName,
  };
};

const templateBlogRegistry = (items) => {
  const templateItem = (item) => `{
    slug: '${item.slug}', 
    title: '${item.title}', 
    component: React.lazy(() => import('${item.component}')), 
    date: '${moment(item.date).format('DD MMM YYYY')}', 
  }`;

  const blogRegistryList = items.map(templateItem).join(',\n');

  const fileContents = `
    import React from 'react';

  export const blogRegistry = [${blogRegistryList}];

  export const slugToId = blogRegistry.reduce((acc, next, idx) => ({
    ...acc,
    [next.slug]: idx,
  }), {});
  `;

  return fileContents;
};

const main = async () => {
  const markdownFiles = await fs.readdir(BLOG_DIRECTORY);
  const items = await Promise.all(markdownFiles.map(fileNameToItem));
  const validItems = items.map(validateEntry);
  const sortedItems = validItems.sort((a, b) => b.date - a.date);
  const fileContents = templateBlogRegistry(sortedItems);
  await fs.writeFile(BLOG_REGISTRY_FILE, fileContents);
};
main();
