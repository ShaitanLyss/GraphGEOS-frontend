import type { NodeEditor } from '$rete/NodeEditor';

export type UploadGraphModalMeta = { editor: NodeEditor };

export type GraphFormData = {
	[key: string]: unknown;
	tags: string[];
	name: string;
	description: string;
	is_public: boolean;
	favorite: boolean;
};
