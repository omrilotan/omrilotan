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

const ORGS = [
	'doowat',
	'fiverr',
	'omrilotan'
]

export default async function activity(username) {
	const json = await exec(`curl https://api.github.com/users/${username}/events`);

	return Array.from(
		new Set(
			JSON.parse(json).filter(
					({ type }) => TYPES.includes(type)
				).map(
					({ repo: { name } }) => name
				).filter(
					(name) => !ORGS.some(org => name.startsWith(org)) // contributing to myself
				)
			)
		);
}


