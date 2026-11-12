export default async function request(url, options = {}) {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`Request to ${url} resulted in status ${response.status}.`);
	}

	return response.text();
}
