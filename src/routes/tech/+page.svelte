<script lang="ts">
	import BubbleOverlay from '$lib/components/bubble/bubble-overlay.svelte';
	import type BubbleGroup from '$lib/components/konva/bubble/bubble-group.svelte';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import TermLinkText from '$lib/components/term-link-text.svelte';
	import TermText from '$lib/components/term-text.svelte';
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

		if ('projects_referenced' in value)
			desc.push(
				`Used in: ${value.projects_referenced} project${value.projects_referenced === 1 ? '' : 's'}`,
			);

		const skillLevel = value.skill_level;
		let skillLevelText = '';
		if (skillLevel) {
			if (skillLevel >= 5) skillLevelText = 'Expert';
			else if (skillLevel >= 4) skillLevelText = 'Advanced';
			else if (skillLevel >= 2) skillLevelText = 'Intermediate';
			else if (skillLevel >= 1) skillLevelText = 'Beginner';
		}
		if (skillLevelText) desc.push(`Experience level: ${skillLevelText}`);

		if (desc.length !== 0) desc.push('');
		desc.push('❗ Click to view more details');

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

	const getTechnologyLinks = (technology: Technology) => {
		const links = [];

		if (technology.url) links.push({ text: 'Website', url: technology.url, external: true });
		links.push({
			text: 'Related Projects',
			url: `/projects?using_technology=${technology.id}`,
			external: false,
		});

		return links;
	};

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	let techCategories: BubbleGroupProps[] = [];
	$: {
		const categories = [];

		for (const [category, technologies] of data.technologies.entries())
			categories.push(createBubbleGroup(category, technologies));

		techCategories = categories;
	}

	let expandedTechnology: Technology | undefined;

	onMount(resize);
</script>

{#if expandedTechnology}
	<BubbleOverlay
		on:close={() => (expandedTechnology = undefined)}
		title={expandedTechnology.name}
		iconUrl={expandedTechnology.logo_url ?? undefined}
		links={getTechnologyLinks(expandedTechnology)}
	/>
{/if}

<svelte:window on:resize={resize} />
<svelte:component
	this={BubbleMap}
	on:click={(e) => {
		const title = e.detail.title;

		let res;
		for (const technologies of data.technologies.values()) {
			res = technologies.find((t) => t.name === title);
			if (res) break;
		}

		expandedTechnology = res;
	}}
	{width}
	{height}
	items={techCategories.map((v) => ({ ...v, radius: $suggestedBubbleRadius }))}
/>

<div class="context-info">
	{#if data.referencedProject}
		<TermText text={`Displaying technologies used by ${data.referencedProject.name}`} />
		<TermLinkText text="Click here to view all technologies" url="/tech" />
	{:else}
		<TermLinkText text="Click to return home" url="/" />
	{/if}
</div>

<style>
	.context-info {
		position: absolute;
		top: 0;
		left: 0;

		padding: 1rem;
	}
</style>
