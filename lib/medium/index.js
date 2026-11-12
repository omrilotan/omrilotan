import request from '../request/index.js';

const decode = (string) => string
	.replace(/<!\[CDATA\[|\]\]>/g, '')
	.replace(/&amp;/g, '&')
	.replace(/&lt;/g, '<')
	.replace(/&gt;/g, '>')
	.replace(/&#0?39;|&apos;|&rsquo;/g, '’')
	.replace(/&quot;/g, '"')
	.replace(/&nbsp;/g, ' ')
	.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const tag = (xml, name) => {
	const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
	return match ? decode(match[1]).trim() : '';
};

const normal = (string) => string.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const summary = (html, title) => {
	let text = html
		.replace(/<figure[\s\S]*?<\/figure>/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	// Medium often repeats the headline as the first sentence; drop that echo.
	if (title && normal(text).startsWith(normal(title))) {
		text = text.replace(/^[^.!?]*[.!?]\s*/, '');
	}

	// Keep the kicker, discard the "TL;DR …" body that follows it.
	const [ kicker ] = text.split(/\s*TL;?\s*DR\b/i);

	return (kicker.trim() || text).trim();
};

export default async function medium(username) {
	const xml = await request(`https://medium.com/feed/@${username}`);

	return xml
		.split('<item>')
		.slice(1)
		.map((chunk) => chunk.split('</item>')[0])
		.filter((item) => /<category/.test(item)) // real posts carry tags; notes and comments do not
		.map((item) => {
			const pubDate = tag(item, 'pubDate');
			const title = tag(item, 'title');

			return {
				title,
				link: tag(item, 'link'),
				date: pubDate ? new Date(pubDate) : null,
				description: summary(tag(item, 'content:encoded'), title),
				categories: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)]
					.map(([, value]) => decode(value).trim())
					.filter(Boolean)
			};
		});
};
