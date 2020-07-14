#!/usr/bin/env node

import fs from 'fs';
import github from './lib/github/index.js';
import list from './lib/list/index.js';
import medium from './lib/medium/index.js';
import read from './lib/read/index.js';

const { promises: { writeFile, mkdir } } = fs;

const articles = await medium('omrilotan');

const activities = await github('omrilotan');

const content = [];

content.push(await read('./chunks/intro.md'));
articles.length && content.push(
	...list('here are some of them:', articles)
)
activities.length && content.push(
	...list('I\'ve been recently active on:', activities)
)

try {
	await mkdir('dist')
} catch {}

writeFile(
    'dist/README.md',
    content.join('\n')
);
