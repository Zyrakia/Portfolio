import type { PageServerLoad } from './$types';
import { q } from '$lib/util/query';
import { z } from 'zod';
import { api } from '$lib/api';

export const load: PageServerLoad = async ({ url }) => {
	const { using_technology } = q(url.searchParams, { using_technology: z.coerce.number() });

	const projectsRequest = api('/projects', 'get', { query: { using_technology: using_technology } });
	const techRequest =
		using_technology !== undefined && api('/tech/[id]', 'get', { params: { id: `${using_technology}` } });

	const [projects, referencedTechnology] = await Promise.all([projectsRequest, techRequest]);
	return { projects, referencedTechnology };
};
