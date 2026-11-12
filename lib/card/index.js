import wrap, { textWidth } from '../wrap/index.js';

const FONT = '-apple-system,BlinkMacSystemFont,\'Segoe UI\',Helvetica,Arial,sans-serif';

// GitHub pinned-repo card palette (Primer), light and dark.
const THEMES = {
	light: { bg: '#ffffff', border: '#d0d7de', title: '#0969da', text: '#59636e', meta: '#59636e', icon: '#59636e', pill: '#59636e', pillBorder: '#d0d7de', light: 45 },
	dark: { bg: '#0d1117', border: '#30363d', title: '#4493f8', text: '#9198a1', meta: '#9198a1', icon: '#9198a1', pill: '#9198a1', pillBorder: '#3d444d', light: 65 }
};

export const WIDTH = 420;
export const HEIGHT = 150;
const PAD = 16;
const INNER = WIDTH - PAD * 2;

// A document glyph (16x16), echoing the repo icon on pinned cards.
const ICON = 'M3.75 1.5A1.25 1.25 0 0 0 2.5 2.75v10.5A1.25 1.25 0 0 0 3.75 14.5h8.5a1.25 1.25 0 0 0 1.25-1.25V5.56a1.25 1.25 0 0 0-.366-.884L9.823 1.866A1.25 1.25 0 0 0 8.94 1.5H3.75ZM9 2.75l3.25 3.25H9.25A.25.25 0 0 1 9 5.75V2.75ZM5.25 7.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5Zm0 3a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z';

const esc = (string) => String(string)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;');

const hue = (string) => [...string].reduce((value, char) => (value * 31 + char.charCodeAt(0)) % 360, 7);

export default function card({ title, date = '', description = '', categories = [] }, theme) {
	const palette = THEMES[theme];
	const titleLines = wrap(title, INNER, 14, 2);
	const descriptionLines = wrap(description, INNER, 12, 2);
	const category = categories[0] || '';
	const dot = `hsl(${hue(category || title)} 65% ${palette.light}%)`;

	const pillText = esc(date);
	const pillWidth = Math.ceil(textWidth(date, 11)) + 16;
	const pillX = WIDTH - PAD - pillWidth;

	const text = (lines, x, y, lineHeight, size, weight, fill) => lines
		.map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" font-size="${size}" font-weight="${weight}" fill="${fill}">${esc(line)}</text>`)
		.join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" fill="none" role="img" aria-label="${esc(title)}" font-family="${FONT}">
	<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" rx="6" fill="${palette.bg}" stroke="${palette.border}"/>
	<path transform="translate(${PAD} 15)" d="${ICON}" fill="${palette.icon}"/>
	${date ? `<rect x="${pillX}" y="14" width="${pillWidth}" height="18" rx="9" fill="none" stroke="${palette.pillBorder}"/><text x="${pillX + pillWidth / 2}" y="26.5" text-anchor="middle" font-size="11" fill="${palette.pill}">${pillText}</text>` : ''}
	${text(titleLines, PAD, 52, 20, 14, 600, palette.title)}
	${text(descriptionLines, PAD, 94, 17, 12, 400, palette.text)}
	${category ? `<circle cx="${PAD + 4}" cy="131" r="5" fill="${dot}"/><text x="${PAD + 15}" y="135" font-size="12" fill="${palette.meta}">${esc(category)}</text>` : ''}
</svg>
`;
}
