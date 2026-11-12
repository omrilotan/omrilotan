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
];

export default async function activity(username) {
	const response = await fetch(`https://api.github.com/users/${username}/events`, {
		headers: {
			'Accept': 'application/vnd.github+json',
			'User-Agent': username
		}
	});

	if (!response.ok) {
		return [];
	}

	const events = await response.json();

	return Array.from(
		new Set(
			events
				.filter(({ type }) => TYPES.includes(type))
				.map(({ repo: { name } }) => name)
				.filter((name) => !ORGS.some((org) => name.startsWith(org))) // contributing to myself
		)
	);
}
