// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { sanityClient } from '@/sanity.config';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function createComment(req: NextApiRequest, res: NextApiResponse) {
	const { _id, comment, email, name } = JSON.parse(req.body);

	try {
		await sanityClient.create({
			_type: 'comment',
			post: { _type: 'reference', _ref: _id },
			name,
			email,
			comment
		});
	} catch (e) {
		return res.status(500).json({ message: 'Something went wrong', e });
	}

	return res.status(200).json({ message: 'Comment created' });
}
