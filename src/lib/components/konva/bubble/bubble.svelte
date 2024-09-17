<script lang="ts">
	import type Konva from 'konva';

	import { createImage } from '$lib/util/create-image';
	import { Group, Circle, Image } from 'svelte-konva';

	import BubbleOutline from './bubble-outline.svelte';
	import BubbleLabel from './bubble-label.svelte';

	let groupRef: Konva.Group | undefined = undefined;

	export let x;
	export let y;
	export let radius = 50;
	export let outlines = 2;
	export let logoUrl: string;
	export let title: string;
	export let description: string | string[] = [];
	export let link: string = "";


	let hover = false;

	$: if (link && groupRef) {
		const container = groupRef.getLayer()?.getStage().container();
		if (container) {
			if (hover) container.style.cursor = 'pointer';
			else container.style.cursor = 'default';
		}
	}
</script>

<Group config={{ x, y }} bind:handle={groupRef}>
	{#each { length: outlines + 1 } as _, i}
		<BubbleOutline {radius} bind:active={hover} level={i} />
	{/each}

	<Circle
		config={{ radius }}
		on:mouseenter={() => (hover = true)}
		on:mouseleave={() => (hover = false)}
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

	<BubbleLabel {title} active={hover} {description} offset={{ x: 0, y: -radius }} />
</Group>
