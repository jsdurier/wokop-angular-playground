export default async function waitDelay(delay_ms: number): Promise<void> {
	return new Promise(resolve => {
		setTimeout(
			() => {
				resolve();
			},
			delay_ms
		);
	});
}
