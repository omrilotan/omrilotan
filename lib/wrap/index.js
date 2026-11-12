// Approximate character widths (as a fraction of font size) for the GitHub
// system font stack, used to wrap text inside an SVG where there is no layout
// engine to measure glyphs for us.
const NARROW = { ' ': 0.28, 'i': 0.28, 'j': 0.3, 'l': 0.28, 't': 0.34, 'f': 0.34, 'r': 0.4, 'I': 0.33, '.': 0.3, ',': 0.3, '\'': 0.24, '’': 0.24, '!': 0.3, '|': 0.26, ':': 0.3, ';': 0.3, '(': 0.34, ')': 0.34, '[': 0.34, ']': 0.34 };
const WIDE = { 'm': 0.86, 'w': 0.74, 'M': 0.86, 'W': 0.95, '@': 0.95 };

const charWidth = (char, size) => {
	if (char in NARROW) return NARROW[char] * size;
	if (char in WIDE) return WIDE[char] * size;
	if (/[A-Z0-9]/.test(char)) return 0.67 * size;
	return 0.56 * size;
};

export const textWidth = (string, size) =>
	[...string].reduce((total, char) => total + charWidth(char, size), 0);

export default function wrap(text, maxWidth, size, maxLines, firstWidth = maxWidth, scale = 1) {
	const words = String(text).replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
	const limit = (index) => (index === 0 ? firstWidth : maxWidth);
	const measure = (string) => textWidth(string, size) * scale; // scale > 1 for bold weights
	const lines = [];
	let line = '';

	for (const word of words) {
		const candidate = line ? `${line} ${word}` : word;
		if (line && measure(candidate) > limit(lines.length)) {
			lines.push(line);
			line = word;
		} else {
			line = candidate;
		}
	}
	if (line) lines.push(line);

	if (lines.length > maxLines) {
		lines.length = maxLines;
		let last = lines[maxLines - 1];
		while (last && measure(`${last}…`) > limit(maxLines - 1)) {
			last = last.replace(/\s*\S$/, '');
		}
		lines[maxLines - 1] = `${last.replace(/[\s,.;:—-]+$/, '')}…`;
	}

	return lines;
}
