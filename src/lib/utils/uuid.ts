import newLocalUniqueId from 'locally-unique-id-generator';
import { v4 as uuidv4 } from 'uuid';

export function newUniqueId(baseName?: string) {
	return `${baseName ?? 'unique-id'}-${newLocalUniqueId()}`;
}

export function newUuid(baseName?: string) {
	return `${baseName ? baseName + '-' : ''}${uuidv4()}`;
}
