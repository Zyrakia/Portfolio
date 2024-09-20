<script lang="ts">
	import { API } from '$lib/api';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount, type ComponentProps } from 'svelte';
	import { z } from 'zod';

	const createTechnologyBubble = (
		value: any,
		projectName?: string,
	): Omit<ComponentProps<Bubble>, 'x' | 'y'> => {
		const desc = [];
		if (projectName) desc.push(`Used in ${projectName}`);
		if (typeof value.skill_level === 'number') desc.push(`⭐`.repeat(value.skill_level).padEnd(5, '❌'));

		return {
			radius: 50,
			title: value.name,
			logoUrl: value.logo_url,
			description: desc.join('\n') || undefined,
			link: value.url,
		};
	};

	let BubbleMap: typeof client_BubbleMap;
	onMount(() => {
		import('$lib/components/konva/bubble/bubble-map.svelte').then((v) => (BubbleMap = v.default));
	});

	let width = 0;
	let height = 0;

	let projectId: number | undefined = undefined;

	let technologies: any[] = [];
	const fetchTechnologies = async () => {
		let res;
		if (projectId === undefined) res = await API.getTechnologies();
		else res = await API.getTechnologiesUsedBy(projectId);

		const { data } = z
			.array(z.object({ name: z.string(), logo_url: z.string() }).passthrough())
			.safeParse(res);
		if (data) technologies = data;
	};

	$: projectQuery = createQuery({
		queryKey: ['project', projectId],
		queryFn: () => (projectId !== undefined ? API.getProject(projectId, false) : null),
	});

	$: project = z.object({ name: z.string().optional() }).passthrough().safeParse($projectQuery.data);
	$: techBubbles = $projectQuery.isFetching
		? []
		: technologies.map((v) => createTechnologyBubble(v, project.data?.name));

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	onMount(() => {
		resize();

		const params = new URLSearchParams(location.search);
		if (params.has('used_by')) {
			const id = parseInt(params.get('used_by')!);
			if (!isNaN(id)) projectId = id;
		}

		fetchTechnologies();
	});
</script>

<svelte:window on:resize={resize} />

<svelte:component this={BubbleMap} {width} {height} items={techBubbles} />
