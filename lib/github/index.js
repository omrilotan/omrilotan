import exec from 'async-execute';

const TYPES = [
	'CommitCommentEvent',
	'IssueCommentEvent',
	'IssuesEvent',
	'PullRequestEvent',
	'PullRequestReviewCommentEvent',
	'PushEvent',
	'ReleaseEvent'
];

export default async function activity(username) {
	const json = await exec(`curl https://api.github.com/users/${username}/events`);

	return JSON.parse(json)
		.filter(
			({ type }) => TYPES.includes(type)
		)
		.reduce(
			(accumulator, { repo: { name: title } }) =>
				accumulator.find(
					({ title: t }) => t === title
				)
					? accumulator
					: [ ...accumulator, { title, link: `https://github.com/${title}` } ]
			,
			[]
		).filter(
			({ title }) => !title.startsWith(username)
		);
}


