<script lang="ts">
	import { browser } from '$app/environment';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import { onMount, type ComponentProps } from 'svelte';
	import { suggestedBubbleRadius } from '$lib/stores/suggested-bubble-radius.js';

	let BubbleMap: typeof client_BubbleMap;
	onMount(() => {
		import('$lib/components/konva/bubble/bubble-map.svelte').then((v) => (BubbleMap = v.default));
	});

	export let data;

	type Project = Routes['/projects']['get']['__response'][number];

	const dateFormatter = new Intl.DateTimeFormat(browser ? navigator.language : 'en-US', {
		dateStyle: 'medium',
	});

	const getProjectTimeline = (rawStartDate?: string, rawEndDate?: string) => {
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

	const createProjectBubble = (value: Project): Omit<ComponentProps<Bubble>, 'x' | 'y'> => {
		const lines = [];

		if (value.description) lines.push(value.description + '\n');

		const formattedTimeline = getProjectTimeline(
			value.start_date ?? undefined,
			value.end_date ?? undefined,
		);
		lines.push(formattedTimeline);

		return {
			radius: $suggestedBubbleRadius,
			title: value.name,
			logoUrl: value.logo_url ?? undefined,
			description: lines.join('\n'),
			link: value.url ?? undefined,
		};
	};

	let width = 0;
	let height = 0;

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	onMount(resize);
</script>

<svelte:window on:resize={resize} />
<svelte:component this={BubbleMap} {width} {height} items={data.projects.map(createProjectBubble)} />
