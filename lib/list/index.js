export default (title, array) => [
	'',
	title,
	'',
	...array.map(
		({ title, link }) => `- [${title}](${link})`
	)
]
