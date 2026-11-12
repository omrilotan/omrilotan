#!/usr/bin/env node

import { writeFile, mkdir, rm } from 'node:fs/promises';
import github from './lib/github/index.js';
import medium from './lib/medium/index.js';
import read from './lib/read/index.js';
import strip from './lib/strip/index.js';
import card, { WIDTH } from './lib/card/index.js';

const [ , , ...args ] = process.argv;
const testing = args.includes('--testing');

const TOP = 6;

const pad = (number) => String(number).padStart(2, '0');
const iso = (date) => [ date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate()) ].join('-');

const articles = await medium('omrilotan');
const featured = articles.slice(0, TOP);

const cards = featured.flatMap((article, index) => {
	const data = { ...article, date: article.date ? iso(article.date) : '' };
	return [
		{ path: `cards/${pad(index + 1)}-light.svg`, svg: card(data, 'light', index) },
		{ path: `cards/${pad(index + 1)}-dark.svg`, svg: card(data, 'dark', index) }
	];
});

const anchor = (article, index) => {
	const n = pad(index + 1);
	return `<a href="${strip(article.link)}"><picture><source media="(prefers-color-scheme: dark)" srcset="cards/${n}-dark.svg"><img alt="${article.title.replace(/"/g, '&quot;')}" src="cards/${n}-light.svg" width="${WIDTH}"></picture></a>`;
};

// Two cards per visual row, laid out as inline images (no <table>, so GitHub
// does not draw cell borders or zebra striping around the cards).
const gallery = [];
for (let index = 0; index < featured.length; index += 2) {
	const pair = [ anchor(featured[index], index) ];
	if (featured[index + 1]) pair.push(anchor(featured[index + 1], index + 1));
	gallery.push(`${pair.join(' ')}<br>`);
}

const content = [];

content.push(await read('./chunks/intro.md'));

if (featured.length) {
	content.push(
		'',
		'### Articles',
		'',
		...gallery
	);
}

const activities = await github('omrilotan');
if (activities.length) {
	content.push(
		'',
		'### Recently active on',
		'',
		...activities.map((name) => {
			const [ username, repo ] = name.split('/');
			const image = `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo}&show_owner=true`;
			return `[![${name}](${image})](https://github.com/${name})`;
		})
	);
}

content.push(
	'',
	'More writings: [omrilotan.medium.com](https://omrilotan.medium.com)'
);

if (testing) {
	console.log(content.join('\n'));
	process.exit(0);
}

await rm('dist', { recursive: true, force: true });
await mkdir('dist/cards', { recursive: true });
await Promise.all([
	writeFile('dist/README.md', `${content.join('\n')}\n`),
	...cards.map(({ path, svg }) => writeFile(`dist/${path}`, svg))
]);
