export type Post = {
	_createdAt: string;
	_id: string;
	author: {
		image: string;
		name: string;
	};
	body: object[];
	description: string;
	mainImage: { alt: string; asset: { url: string } } | null;
	slug: { current: string };
	title: string;
};

export type PostPath = {
	_id: string;
	slug: { current: string };
};
