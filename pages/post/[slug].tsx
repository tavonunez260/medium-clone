import { clsx } from 'clsx';
import { GetStaticPaths } from 'next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PortableText from 'react-portable-text';

import { Header, Toast } from '@/components';
import { sanityClient, urlFor } from '@/sanity.config';
import { Post } from '@/typings';
import { rules } from '@/utils';

interface Props {
	post: Post;
}

type CommentForm = {
	comment: string;
	email: string;
	name: string;
};

export default function Post({ post }: Props) {
	const {
		formState: { errors },
		handleSubmit,
		register,
		reset
	} = useForm<CommentForm>();
	const [loading, setLoading] = useState(false);
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [showToast, setShowToast] = useState(false);

	const showNotification = (newTitle: string, newSubtitle: string): void => {
		setTitle(newTitle);
		setSubtitle(newSubtitle);
		setShowToast(true);
	};

	const onSubmit = async (data: CommentForm) => {
		setLoading(true);
		fetch('/api/createComment', {
			method: 'POST',
			body: JSON.stringify({ _id: post._id, ...data })
		})
			.then(() => {
				showNotification('Comment Submitted', 'Your comment has been submitted for review');
				reset();
			})
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	};

	return (
		<>
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
				<hr className="max-w-lg my-5 mx-auto border border-yellow-500" />
				<form
					className="flex flex-col max-w-2xl p-5 mx-auto mb-10"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
				>
					<label className="block mb-5">
						<span className="text-gray-700 ">Name</span>
						<input
							{...register('name', rules.name)}
							className="shadow border rounded py-2 px-3 form-input mt-1 block w-full focus:ring-2 ring-yellow-500 outline-none"
							id="name"
							type="text"
						/>
						{errors.name && (
							<span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
						)}
					</label>
					<label className="block mb-5">
						<span className="text-gray-700 ">Email</span>
						<input
							{...register('email', rules.email)}
							className="shadow border rounded py-2 px-3 form-input mt-1 block w-full focus:ring-2 ring-yellow-500 outline-none"
							id="email"
							type="text"
						/>
						{errors.email && (
							<span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
						)}
					</label>
					<label className="block mb-5">
						<span className="text-gray-700 ">Comment</span>
						<textarea
							{...register('comment', rules.comment)}
							className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full focus:ring-2 ring-yellow-500 outline-none"
							id="comment"
							rows={8}
						/>
						{errors.comment && (
							<span className="text-red-500 text-xs mt-1">{errors.comment.message}</span>
						)}
					</label>
					<button
						className={clsx(
							'shadow font-bold py-2 px-4 rounded cursor-pointer outline-none transition duration-200 ease-in-out text-white', // Grouped non-conditional classes
							{
								'bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline': !loading,
								'bg-gray-500 hover:bg-gray-400 cursor-not-allowed': loading
							}
						)}
					>
						{loading ? 'Loading...' : 'Submit'}
					</button>
				</form>
				{post.comments && post.comments.length > 0 && (
					<section className="max-w-2xl mx-auto flex flex-col p-10 my-10 shadow shadow-yellow-500 gap-2">
						<h3 className="text-3xl font-bold mb-5">Comments</h3>
						<hr />
						{post.comments.map(comment => (
							<div key={comment._id} className="mb-5">
								<p>
									<span className="text-yellow-500">{comment.name}</span>: {comment.comment}
								</p>
							</div>
						))}
					</section>
				)}
			</main>
			<Toast show={showToast} subtitle={subtitle} title={title} />
		</>
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
			post._ref == ^._id &&
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
