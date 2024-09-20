<script lang="ts">
	import { browser } from '$app/environment';
	import { API } from '$lib/api';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { onMount, type ComponentProps } from 'svelte';
	import { z } from 'zod';

	const dateFormatter = new Intl.DateTimeFormat(browser ? navigator.language :'en-US', {
		dateStyle: 'medium',
	});

	const getProjectTimeline = (rawStartDate: string | undefined, rawEndDate: string | undefined) => {
		if (!rawStartDate) {
			if (!rawEndDate) return '( In ongoing development )';
			else {
				const endDate = new Date(rawEndDate);
				return `( Finished on ${dateFormatter.format(endDate)} )`;
			}
		}

		if (!rawEndDate) {
			const startDate = new Date(rawStartDate);
			return `( ${dateFormatter.format(startDate)} - Present )`;
		}

		const startDate = new Date(rawStartDate);
		const endDate = new Date(rawEndDate);
		return `( ${dateFormatter.format(startDate)} - ${dateFormatter.format(endDate)} )`;
	};

	const createProjectBubble = (
		value: any,
		technologyName?: string,
	): Omit<ComponentProps<Bubble>, 'x' | 'y'> => {
		return {
			radius: 50,
			title: value.name,
			logoUrl: value.logo_url,
			description: `${value.description}\n\n${technologyName ? `Using: ${technologyName}\n` : ''}${value.technologies_referenced !== undefined ? `\nReferenced technologies: ${value.technologies_referenced}\n` : ''}${getProjectTimeline(value.start_date, value.end_date)}`,
			link: value.url,
		};
	};

	let BubbleMap: typeof client_BubbleMap;
	onMount(() => {
		import('$lib/components/konva/bubble/bubble-map.svelte').then((v) => (BubbleMap = v.default));
	});

	let width = 0;
	let height = 0;

	let technologyId: number | undefined = undefined;

	let projects: any[] = [];
	const fetchProjects = async () => {
		let res;
		if (technologyId === undefined) res = await API.getProjects();
		else res = await API.getProjectsUsing(technologyId);

		const { data } = z
			.array(z.object({ name: z.string(), logo_url: z.string() }).passthrough())
			.safeParse(res);
		if (data) projects = data;
	};

	$: technologyQuery = createQuery({
		queryKey: ['technology', technologyId],
		queryFn: () => (technologyId !== undefined ? API.getTechnology(technologyId) : null),
	});

	$: technology = z.object({ name: z.string().optional() }).passthrough().safeParse($technologyQuery.data);
	$: projectBubbles = $technologyQuery.isFetching
		? []
		: projects.map((v) => createProjectBubble(v, technology.data?.name));

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	onMount(() => {
		resize();

		const params = new URLSearchParams(location.search);
		if (params.has('using')) {
			const id = parseInt(params.get('using')!);
			if (!isNaN(id)) technologyId = id;
		}

		fetchProjects();
	});
</script>

<svelte:window on:resize={resize} />

<svelte:component this={BubbleMap} {width} {height} items={projectBubbles} />
