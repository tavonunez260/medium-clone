import Link from 'next/link';

import { Header } from '@/components';
import { sanityClient, urlFor } from '@/sanity.config';
import { Post } from '@/typings';

interface Props {
	posts: Post[];
}

export default function Home({ posts }: Props) {
	return (
		<>
			<Header />
			<main>
				<section className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
					<div className="px-10 my-5">
						<h1 className="text-6xl max-w-xl font-serif">
							<span className="underline decoration-black decoration-4">Medium</span> is a place to
							write, read and connect
						</h1>
						<h2>
							It&apos;s easy and free to post your thinking on any topic and connect with millions
							of readers.
						</h2>
					</div>
					<img
						alt="Medium large logo"
						className="hidden md:inline-flex h-32 lg:h-full"
						src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
					/>
				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
					{posts.map(post => (
						<Link key={post._id} href={`/post/${post.slug.current}`}>
							<div className="group cursor-pointer border rounded-lg overflow-hidden">
								{post.mainImage && (
									<img
										alt={post.mainImage.alt}
										className="h-60 w-full object-cover group-hover:scale-105 transition duration-200 ease-in-out"
										src={urlFor(post.mainImage).url()}
									/>
								)}
								<div className="flex justify-between p-5 bg-white">
									<div>
										<h3 className="text-lg font-bold">{post.title}</h3>
										<p className="text-xs">
											{post.description} by {post.author.name}
										</p>
									</div>
									<img
										alt={`post ${post.author.name} img`}
										className="h-12 w-12 rounded-full"
										src={urlFor(post.author.image).url()}
									/>
								</div>
							</div>
						</Link>
					))}
				</section>
			</main>
		</>
	);
}

export const getServerSideProps = async () => {
	const query = `*[_type == "post"] {
		_id,
		_createdAt,
		title,
		author-> { name, image },
		slug,
		body,		
		"categories": categories[]->title,
		description,
		mainImage
	}`;

	const posts = await sanityClient.fetch(query);
	return {
		props: {
			posts
		}
	};
};
