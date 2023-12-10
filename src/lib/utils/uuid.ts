import newLocalUniqueId from 'locally-unique-id-generator';

export function newUniqueId(baseName?: string) {
	return `${baseName ?? 'unique-id'}-${newLocalUniqueId()}`;
}
