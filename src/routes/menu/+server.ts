import { json } from '@sveltejs/kit';
import { walkSync } from '../../utils/file';

export async function GET() {
	const files = walkSync('src/rete/node', '', []);

	return json(files);
}
