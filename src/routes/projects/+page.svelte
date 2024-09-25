<script lang="ts">
	import { browser } from '$app/environment';
	import type Bubble from '$lib/components/konva/bubble/bubble.svelte';
	import type client_BubbleMap from '$lib/components/konva/bubble/bubble-map.svelte';
	import { onMount, type ComponentProps } from 'svelte';
	import { suggestedBubbleRadius } from '$lib/stores/suggested-bubble-radius.js';
	import BubbleOverlay from '$lib/components/bubble/bubble-overlay.svelte';
	import TermText from '$lib/components/term-text.svelte';
	import TermLinkText from '$lib/components/term-link-text.svelte';

	let BubbleMap: typeof client_BubbleMap;
	onMount(() => {
		import('$lib/components/konva/bubble/bubble-map.svelte').then((v) => (BubbleMap = v.default));
	});

	type Project = Routes['/projects']['get']['__response'][number];

	export let data;

	let width = 0;
	let height = 0;

	const dateFormatter = new Intl.DateTimeFormat(browser ? navigator.language : 'en-US', {
		month: 'short',
		year: 'numeric',
	});

	const getProjectTimeline = (rawStartDate?: string, rawEndDate?: string) => {
		if (!rawStartDate && !rawEndDate) return 'In continual development';

		let startDate;
		let endDate;
		if (rawStartDate) startDate = new Date(rawStartDate);
		if (rawEndDate) endDate = new Date(rawEndDate);

		const startLabel = startDate ? dateFormatter.format(startDate) : 'Unknown';
		const endLabel = endDate ? dateFormatter.format(endDate) : 'Present';

		return `${startLabel} - ${endLabel}`;
	};

	const createProjectBubble = (value: Project): Omit<ComponentProps<Bubble>, 'x' | 'y' | 'radius'> => {
		const lines = [];

		if (value.description) lines.push(value.description + '\n');

		const formattedTimeline = getProjectTimeline(
			value.start_date ?? undefined,
			value.end_date ?? undefined,
		);

		lines.push(`Timeline: ${formattedTimeline}`);
		if ('technologies_referenced' in value)
			lines.push(`Using: ${value.technologies_referenced} technologies`);
		lines.push('');
		lines.push('❗ Click to view more details');

		return {
			title: value.name,
			logoUrl: value.logo_url ?? undefined,
			description: lines.join('\n'),
			link: value.url ?? undefined,
		};
	};

	const resize = () => {
		width = window.innerWidth;
		height = window.innerHeight;
	};

	const getProjectLinks = (project: Project) => {
		const links = [];

		if (project.url) links.push({ text: 'Website', url: project.url });
		links.push({ text: 'Used Technologies', url: `/tech?used_by_project=${project.id}` });

		return links;
	};

	let expandedProject: Project | undefined;

	onMount(resize);
</script>

{#if expandedProject}
	<BubbleOverlay
		on:close={() => (expandedProject = undefined)}
		title={expandedProject.name}
		iconUrl={expandedProject.logo_url ?? undefined}
		links={getProjectLinks(expandedProject)}
	>
		{#if expandedProject.description}
			<p>{expandedProject.description}</p>
		{/if}
	</BubbleOverlay>
{/if}

{#if data.referencedTechnology}
	<div class="context-info">
		<TermText text={`Displaying projects that use ${data.referencedTechnology.name}`} />
	</div>
{/if}

<svelte:window on:resize={resize} />
<svelte:component
	this={BubbleMap}
	on:click={(e) => {
		const title = e.detail.title;
		expandedProject = data.projects.find((p) => p.name === title);
	}}
	{width}
	{height}
	items={data.projects.map((v) => ({ ...createProjectBubble(v), radius: $suggestedBubbleRadius }))}
/>

<div class="context-info">
	{#if data.referencedTechnology}
		<TermText text={`Displaying projects that use  ${data.referencedTechnology.name}`} />
		<TermLinkText text="Click here to view all projects" url="/projects" />
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
