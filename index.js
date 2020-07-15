#!/usr/bin/env node

import fs from 'fs';
import github from './lib/github/index.js';
import medium from './lib/medium/index.js';
import read from './lib/read/index.js';

const { promises: { writeFile, mkdir } } = fs;

const articles = await medium('omrilotan');

const activities = await github('omrilotan');

const content = [];

content.push(await read('./chunks/intro.md'));

articles.length && content.push(
	'',
	'here are some of them:',
	'',
	...articles.map(
		({ title, link }) => `- [${title}](${link})`
	)
);

activities.length && content.push(
	'',
	'I\'ve been recently active on:',
	'',
	...activities.map(
		name => {
			const [ username, repo ] = name.split('/');
			const image = `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo}`;

			return `[![](${image})](https://github.com/${name})`;
		}
	)
)

try {
	await mkdir('dist')
} catch {}

writeFile(
    'dist/README.md',
    content.join('\n')
);
