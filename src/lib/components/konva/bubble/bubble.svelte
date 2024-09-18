<script lang="ts">
	import type Konva from 'konva';

	import { createImage } from '$lib/util/create-image';
	import { Group, Circle, Image } from 'svelte-konva';

	import BubbleOutline from './bubble-outline.svelte';
	import BubbleLabel from './bubble-label.svelte';
	import { createEventDispatcher } from 'svelte';

	let groupRef: Konva.Group | undefined = undefined;
	const emit = createEventDispatcher();

	export let x: number;
	export let y: number;
	export let radius = 50;
	export let outlines = 2;
	export let title: string;
	export let logoUrl: string;
	export let description: string | undefined;
	export let link: string = '';

	let active = false;
	$: emit('active', active);

	$: if (link && groupRef) {
		const container = groupRef.getLayer()?.getStage().container();
		if (container) {
			if (active) container.style.cursor = 'pointer';
			else container.style.cursor = 'default';
		}
	}
</script>

<Group config={{ x, y }} bind:handle={groupRef}>
	<BubbleLabel {title} {active} {description} offset={{ x: 0, y: -radius }} />

	{#each { length: outlines + 1 } as _, i}
		<BubbleOutline {radius} bind:active level={i} />
	{/each}

	<Circle
		config={{ radius }}
		on:mouseenter={() => (active = true)}
		on:mouseleave={() => (active = false)}
		on:click={() => link && location.assign(link)}
	/>

	<Image
		config={{
			image: createImage(logoUrl, 'todo'),
			width: radius * 2 - radius * 0.5,
			height: radius * 2 - radius * 0.5,
			offsetX: radius - (radius * 0.5) / 2,
			offsetY: radius - (radius * 0.5) / 2,
			listening: false,
			perfectDrawEnabled: false,
		}}
	/>
</Group>
