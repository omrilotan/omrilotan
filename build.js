#!/usr/bin/env node

const { writeFile, mkdir } = require('fs').promises;
const medium = require('./lib/medium');

start();

async function start() {
	const { articles } = await medium();

	const content = [
		'# Hi.<br>My name is Omri.',
		'',
		'I\'m passionate about contributing to open-source software. Look at the six projects I chose to display here, below. I change them sometimes.',
		'',
		'Check out some things I wrote on [Medium](https://medium.com/@omrilotan) maybe. I hope you can find something helpful.',
		'here are some of them:',
		'',
		...articles.map(({ title, link }) => `- [${title}](${link})`)
	].join('\n')

	try {
		await mkdir('dist')
	} catch {}

  writeFile(
      'dist/README.md',
      content
  );
}
