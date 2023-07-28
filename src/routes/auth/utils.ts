type SchemeData = {
	scheme: string;
	path: string;
	params: { [key: string]: string };
};

export function parse_scheme_request(request: string): SchemeData | null {
	const pattern = /^([\w-]+?):\/\/((?:[\w-]+?\/?)+)\??((?:[\w-]+?=[\w-]+&?)*)$/;
	const match = request.match(pattern);
	if (match) {
		const [, scheme, path, params] = match;
		const params_dict: { [key: string]: string } = {};
		params.split('&').forEach((param) => {
			const [key, value] = param.split('=');
			params_dict[key] = value;
		});

		return { scheme, path, params: params_dict };
	}
	return null;
}
