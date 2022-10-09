const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const recursive = require('recursive-readdir');
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
  const slug = fileName.split('/')[0];
  const fullPath = path.join(BLOG_DIRECTORY, fileName);
  const contents = (await fs.readFile(fullPath)).toString();
  const lines = contents.split('\n');

  const titleLine = lines.filter((line) => line.startsWith('# '))[0];
  const title = titleLine.split('# ')[1];

  const dateRegex = /<date>(.*)<\/date>/;
  const dateLine = lines.filter((line) => line.match(dateRegex))[0];
  const maybeDate = dateLine.match(dateRegex)[1];
  const date = Date.parse(maybeDate);

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
  const filePaths = await recursive(BLOG_DIRECTORY);
  const markdownFiles = filePaths.filter((filePath) => filePath.endsWith('.mdx'));
  const posixPaths = markdownFiles.map((markdownFile) => markdownFile.replaceAll('\\', '/'));
  const relativePaths = posixPaths
    .map((posixPath) => path.posix.relative(BLOG_DIRECTORY, posixPath));
  const items = await Promise.all(relativePaths.map(fileNameToItem));
  const validItems = items.map(validateEntry);
  const sortedItems = validItems.sort((a, b) => b.date - a.date);
  const fileContents = templateBlogRegistry(sortedItems);
  await fs.writeFile(BLOG_REGISTRY_FILE, fileContents);
};
main();
