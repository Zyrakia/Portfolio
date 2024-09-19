<script lang="ts">
	import type Konva from 'konva';

	import { createImage } from '$lib/util/create-image';
	import { Group, Circle, Image } from 'svelte-konva';

	import BubbleOutline from './bubble-outline.svelte';
	import BubbleLabel from './bubble-label.svelte';
	import { createEventDispatcher } from 'svelte';
	import { spring } from 'svelte/motion';
	import type { SceneContext } from 'konva/lib/Context';
	import { activeBubbleTitle } from '$lib/stores/active-bubble';

	let groupRef: Konva.Group | undefined = undefined;
	let logoRef: Konva.Image | undefined = undefined;
	const emit = createEventDispatcher();

	export let x: number;
	export let y: number;
	export let radius: number;
	export let outlines = 2;
	export let title: string;
	export let logoUrl: string;
	export let description: string | undefined;
	export let link: string = '';
	export let opacity = 1;

	$: active = $activeBubbleTitle === title;
	$: emit('toggle', active);

	let animatedOpacity = spring(opacity);
	$: animatedOpacity.set(opacity);

	$: if (link && groupRef) {
		const container = groupRef.getLayer()?.getStage().container();
		if (container) {
			if (active) container.style.cursor = 'pointer';
			else container.style.cursor = 'default';
		}
	}

	$: imageSize = radius * 1.25;
	$: imageClipFunction = (ctx: SceneContext) => ctx.arc(0, 0, imageSize * 0.7, 0, Math.PI * 2, false);

	const redirect = () => link && window.location.assign(link);
	const handleToggle = (toggle: boolean) => {
		if (toggle) $activeBubbleTitle = title;
		else if (active) $activeBubbleTitle = undefined;
	};
</script>

<svelte:window on:click={() => handleToggle(false)} />

<Group config={{ x, y, opacity: $animatedOpacity }} bind:handle={groupRef}>
	{#each { length: outlines + 1 } as _, i}
		<BubbleOutline {radius} {active} level={i} />
	{/each}

	<Circle
		config={{ radius }}
		on:mouseenter={() => handleToggle(true)}
		on:mouseleave={() => handleToggle(false)}
		on:click={redirect}
		on:tap={() => {
			if (active) redirect();
			handleToggle(!active);
		}}
	/>

	<Group config={{ clipFunc: imageClipFunction }}>
		<Image
			bind:handle={logoRef}
			config={{
				image: createImage(logoUrl, title),
				width: imageSize,
				height: imageSize,
				offsetX: imageSize / 2,
				offsetY: imageSize / 2,
				listening: false,
				perfectDrawEnabled: false,
				shadowEnabled: true,
				shadowColor: 'darkgreen',
				shadowBlur: 10,
			}}
		/>
	</Group>

	<BubbleLabel {title} {active} {description} offset={{ x: 0, y: -radius }} />
</Group>
