import { GetStaticPaths } from 'next';
import PortableText from 'react-portable-text';

import { Header } from '@/components';
import { sanityClient, urlFor } from '@/sanity.config';
import { Post } from '@/typings';

interface Props {
	post: Post;
}

export default function Post({ post }: Props) {
	console.log(post);
	return (
		<main>
			<Header />
			{post.mainImage && (
				<img
					alt={post.mainImage.alt}
					className="w-full h-80 object-cover"
					src={urlFor(post.mainImage).url()}
				/>
			)}
			<article className="max-w-3xl mx-auto p-5">
				<h1 className="text-4xl mt-10 mb-3">{post.title}</h1>
				<h2 className="text-2xl font-light text-gray-500 mb-2">{post.description}</h2>
				<div className="flex items-center gap-2">
					<img
						alt={post.author.name}
						className="h-10 w-10 rounded-full"
						src={urlFor(post.author.image).url()}
					/>
					<p className="font-extralight text-sm">
						Blog post by <span className="text-green-600">{post.author.name}</span> - Published at{' '}
						{new Date(post._createdAt).toLocaleString()}
					</p>
				</div>
				<div className="mt-10">
					{post.body && post.body.length > 0 && (
						<PortableText
							content={post.body}
							dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
							projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
							serializers={{
								h1: (props: object) => <h1 className="text-3xl font-bold my-5" {...props} />,
								h2: (props: object) => <h2 className="text-2xl font-bold my-5" {...props} />,
								h3: (props: object) => <h2 className="text-xl font-bold my-5" {...props} />,
								li: ({ children }: never) => <li className="list-disc ml-4">{children}</li>,
								link: ({ children, href }: never) => (
									<a className="text-blue-500 hover:underline" href={href}>
										{children}
									</a>
								)
							}}
						/>
					)}
				</div>
			</article>
		</main>
	);
}

export const getStaticProps = async ({ params }: { params?: { slug: string } }) => {
	const query = `*[_type == "post" && slug.current == $slug][0] {
		_id,
		_createdAt,
		title,
		author-> { name, image },
		slug,
		body,
		'comments': *[
			_type == 'comment' &&
			post._ref && ^._id &&
			approved == true
		],
		description,
		mainImage		
	}`;
	const post = await sanityClient.fetch(query, { slug: params?.slug });

	if (!post) {
		return {
			notFound: true
		};
	} else {
		return {
			props: {
				post
			},
			revalidate: 3600
		};
	}
};

export const getStaticPaths: GetStaticPaths = async () => {
	const query = `*[_type == "post"] {
		_id,
		slug {
			current
		}
	}`;
	const posts = await sanityClient.fetch(query);

	const paths = posts.map((post: Post) => ({
		params: { slug: post.slug.current }
	}));

	return {
		paths,
		fallback: 'blocking'
	};
};
