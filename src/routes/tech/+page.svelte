<script lang="ts">
	import type BubbleGroup from '$lib/components/konva/bubble/bubble-group.svelte';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import { suggestedBubbleRadius } from '$lib/stores/suggested-bubble-radius.js';
	import { onMount, type ComponentProps } from 'svelte';

	let BubbleMap: typeof client_BubbleMap;
	onMount(() => {
		import('$lib/components/konva/bubble/bubble-map.svelte').then((v) => (BubbleMap = v.default));
	});

	type BubbleProps = Omit<ComponentProps<Bubble>, 'x' | 'y' | 'radius'>;
	type BubbleGroupProps = Omit<ComponentProps<BubbleGroup>, 'x' | 'y' | 'radius'>;
	type Technology = Routes['/tech']['get']['__response'][number];

	export let data;

	let width = 0;
	let height = 0;

	const createBubble = (value: Technology) => {
		const desc = [];

		const skillLevel = value.skill_level;
		if (skillLevel) desc.push(`⭐`.repeat(skillLevel).padEnd(5, '❌'));

		return {
			title: value.name,
			logoUrl: value.logo_url ?? undefined,
			description: desc.join('\n') || undefined,
			link: value.url ?? undefined,
		} satisfies BubbleProps;
	};

	const createBubbleGroup = (category: string, values: Technology[]) => {
		const bubbles: BubbleProps[] = [];
		for (const value of values) bubbles.push(createBubble(value));

		return {
			groupName: category,
			bubbles,
		} satisfies BubbleGroupProps;
	};

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	const techCategories: BubbleGroupProps[] = [];
	for (const [category, technologies] of data.technologies.entries())
		techCategories.push(createBubbleGroup(category, technologies));

	onMount(resize);
</script>

<svelte:window on:resize={resize} />
<svelte:component
	this={BubbleMap}
	{width}
	{height}
	items={techCategories.map((v) => ({ ...v, radius: $suggestedBubbleRadius }))}
/>
