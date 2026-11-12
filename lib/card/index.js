import wrap, { textWidth } from '../wrap/index.js';

const FONT = '-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif';

// GitHub pinned-repo card palette (Primer), light and dark.
const THEMES = {
	light: { bg: '#ffffff', border: '#d0d7de', title: '#0969da', text: '#59636e', meta: '#59636e', icon: '#59636e', dotBorder: '#d0d7de', light: 45 },
	dark: { bg: '#0d1117', border: '#454c54', title: '#4493f8', text: '#9198a1', meta: '#9198a1', icon: '#9198a1', dotBorder: '#59636e', light: 65 }
};

export const WIDTH = 420;
export const HEIGHT = 140;
const PAD = 16;
const INNER = WIDTH - PAD * 2;
const ICON_SPACE = 22; // icon width plus the gap before the title

// A document glyph (16x16), echoing the repo icon on pinned cards.
const ICON = 'M3.75 1.5A1.25 1.25 0 0 0 2.5 2.75v10.5A1.25 1.25 0 0 0 3.75 14.5h8.5a1.25 1.25 0 0 0 1.25-1.25V5.56a1.25 1.25 0 0 0-.366-.884L9.823 1.866A1.25 1.25 0 0 0 8.94 1.5H3.75ZM9 2.75l3.25 3.25H9.25A.25.25 0 0 1 9 5.75V2.75ZM5.25 7.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Zm0 3a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z';

const esc = (string) => String(string)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;');

export default function card({ title, date = '', description = '', categories = [] }, theme, index = 0) {
	const palette = THEMES[theme];
	// First title line leaves room for the inline icon; wrapped lines run full width.
	const titleLines = wrap(title, INNER, 14, 2, INNER - ICON_SPACE, 1.07);
	const descriptionLines = wrap(description, INNER, 12, 2);
	const category = categories[0] || '';
	// Golden-angle hue spread keeps every card's dot a distinct, intentional colour.
	const dot = `hsl(${Math.round((index * 137.508) % 360)} 65% ${palette.light}%)`;

	const titleRows = titleLines
		.map((line, index) => `<text x="${index === 0 ? PAD + ICON_SPACE : PAD}" y="${28 + index * 20}" font-size="14" font-weight="600" fill="${palette.title}">${esc(line)}</text>`)
		.join('');

	const descriptionRows = descriptionLines
		.map((line, index) => `<text x="${PAD}" y="${74 + index * 17}" font-size="12" fill="${palette.text}">${esc(line)}</text>`)
		.join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" role="img" aria-label="${esc(title)}" font-family="${FONT}">
	<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="6" fill="${palette.bg}" stroke="${palette.border}"/>
	<path transform="translate(${PAD} 16)" d="${ICON}" fill="${palette.icon}"/>
	${titleRows}
	${descriptionRows}
	${category ? `<circle cx="${PAD + 6}" cy="${HEIGHT - 20}" r="6" fill="${dot}" stroke="${palette.dotBorder}"/><text x="${PAD + 19}" y="${HEIGHT - 16}" font-size="12" fill="${palette.meta}">${esc(category)}</text>` : ''}
	${date ? `<text x="${WIDTH - PAD}" y="${HEIGHT - 16}" text-anchor="end" font-size="12" fill="${palette.meta}">${esc(date)}</text>` : ''}
</svg>
`;
}
