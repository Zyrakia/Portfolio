import type { PageServerLoad } from './$types';
import { q } from '$lib/util/query';
import { z } from 'zod';
import { api } from '$lib/api';

const arrangeByCategory = <T extends { category: string | null | undefined }>(technologies: T[]) => {
	const categories = new Map<string, T[]>();

	for (const tech of technologies) {
		const category = tech.category ?? 'Uncategorized';
		const items = categories.get(category) ?? [];
		items.push(tech);
		categories.set(category, items);
	}

	return categories;
};

export const load: PageServerLoad = async ({ url }) => {
	const { used_by_project } = q(url.searchParams, { used_by_project: z.coerce.number() });

	const techRequest = api('/tech', 'get', { query: { used_by_project: used_by_project } });
	const projectRequest =
		used_by_project !== undefined &&
		api('/projects/[id]', 'get', { params: { id: `${used_by_project}` } });

	const [technologies, referencedProject] = await Promise.all([techRequest, projectRequest]);
	return { technologies: arrangeByCategory(technologies), referencedProject };
};
