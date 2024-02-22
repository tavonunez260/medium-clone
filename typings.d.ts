export type PostRef = {
	_ref: string;
	_type: string;
};

export type Comment = {
	_createdAt: Date;
	_id: string;
	_rev: string;
	_type: string;
	_updatedAt: Date;
	approved: boolean;
	comment: string;
	email: string;
	name: string;
	post: PostRef;
};

export type Post = {
	_createdAt: string;
	_id: string;
	author: {
		image: string;
		name: string;
	};
	body: object[];
	comments: Comment[];
	description: string;
	mainImage: { alt: string; asset: { url: string } } | null;
	slug: { current: string };
	title: string;
};
