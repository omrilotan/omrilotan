#!/usr/bin/env node

import fs from 'fs';
import github from './lib/github/index.js';
import medium from './lib/medium/index.js';
import read from './lib/read/index.js';
import strip from './lib/strip/index.js';

const { promises: { writeFile, mkdir } } = fs;
const [ , , ...args ] = process.argv;
const testing = args.includes('--testing');
const content = [];

content.push(await read('./chunks/intro.md'));

const articles = await medium('omrilotan');

const d = date => [
	date.getFullYear(),
	date.getMonth(),
	date.getDate()
].map(
	num => num < 10 ? `0${num}` : `${num}`
).join('-')

articles.length && content.push(
	'Articles',
	'',
	...articles.map(
		({ title, link, date }) => `- [${date ? `${d(date)} ` : ''}${title}](${strip(link)})`
	)
);

const activities = await github('omrilotan');
activities.length && content.push(
	'',
	'I\'ve been recently active on:',
	'',
	...activities.map(
		name => {
			const [ username, repo ] = name.split('/');
			const image = `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo}&show_owner=true`;

			return `[![](${image})](https://github.com/${name})`;
		}
	)
);

if (testing) {
	console.log(content.join('\n'));
	process.exit(0);
}

await mkdir(
	'dist',
	{ recursive: true }
);
writeFile(
	'dist/README.md',
	content.join('\n')
);
