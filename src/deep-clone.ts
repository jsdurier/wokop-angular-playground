export default function deepClone(data: any): any {
	if (Array.isArray(data)) {
		return data.map(deepClone);
	}
	if (typeof data === 'object') {
		return Object.keys(data).reduce(
			(
				prev,
				curr
			) => {
				return {
					...prev,
					[curr]: deepClone(data[curr])
				};
			},
			{}
		);
	}
	return data;
}
