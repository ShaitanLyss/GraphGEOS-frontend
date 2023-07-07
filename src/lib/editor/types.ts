import type { EditorExample } from '$rete/example/types';

export type EditorView = { key: string; example?: EditorExample; label: string };

export type Graph = { id: string; name: string; description: string; data: any; author_id: string };
export type User = { id: string; name: string; email: string; image: string };
