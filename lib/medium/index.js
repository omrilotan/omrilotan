import XMLJS from 'xml-js';
import request from '../request/index.js';

const { xml2json } = XMLJS;

export default async function medium(username) {
	const xml = await request(`https://medium.com/feed/@${username}`);
	const feed = JSON.parse(xml2json(xml));

	return extract(feed);
};

const extract = ({ elements: [ { elements: [ { elements } ] } ] }) => elements
	.filter(({ name }) => name === 'item')
	.filter(
		({ elements }) => elements.find(({ name }) => name === 'category')
	)
	.map(pull);

const pull = ({ elements }) => ({
	title: content(elements.find(({ name }) => name === 'title').elements.pop()),
	link: content(elements.find(({ name }) => name === 'link').elements.pop())
});

const content = (element) => element[element.type];
