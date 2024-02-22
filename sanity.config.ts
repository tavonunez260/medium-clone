/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/pages/studio/[[...index]].tsx` route
 */

import createImageUrlBuilder from '@sanity/image-url';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { visionTool } from '@sanity/vision';
import { createClient } from 'next-sanity';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env';
import { schema } from './sanity/schema';

export const config = {
	basePath: '/studio',
	projectId,
	dataset,
	// Add and edit the content schema in the './sanity/schema' folder
	schema,
	plugins: [
		structureTool(),
		// Vision is a tool that lets you query your content with GROQ in the studio
		// https://www.sanity.io/docs/the-vision-plugin
		visionTool({ defaultApiVersion: apiVersion })
	],
	apiVersion: '2021-08-31',
	useCdn: process.env.NODE_ENV === 'production',
	token: process.env.SANITY_API_TOKEN
};
export const sanityClient = createClient(config);

export const urlFor = (source: SanityImageSource) => createImageUrlBuilder(config).image(source);

export default defineConfig(config);
