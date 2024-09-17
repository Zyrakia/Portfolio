<script lang="ts">
	import type Konva from 'konva';
	import type { Vector2d } from 'konva/lib/types';
	import { onMount, tick } from 'svelte';
	import { Group, Rect, Text } from 'svelte-konva';
	import { spring } from 'svelte/motion';

	export let title: string;
	export let description: string | string[] = [];
	$: descriptionLines = Array.isArray(description) ? description : [description];
	export let active = false;
	export let offset: Vector2d = { x: 0, y: 0 };
	export let fontSize = 20;
	export let lineHeight = 6;

	let groupRef: Konva.Group | undefined = undefined;

	let bgPadding = 20;
	let bgWidth = 0;
	let bgHeight = 0;

	const opacity = spring(0);
	const offsetX = spring(0);
	const offsetY = spring(0);

	$: if (active) {
		offsetY.set(offset.y);
		opacity.set(1);
	} else {
		offsetY.set(0);
		opacity.set(0);
	}

	$: offsetX.set(bgWidth / 2 + offset.x);

	const adjustSize = () => {
		if (!groupRef) return;

		const rect = groupRef.getClientRect();
		bgWidth = rect.width + bgPadding;
		bgHeight = rect.height + bgPadding;
	};

	onMount(async () => {
		await tick();
		if (!groupRef) return;
		adjustSize();
	});
</script>

<Group config={{ offsetX: $offsetX + offset.x, offsetY: $offsetY, opacity: $opacity }}>
	<Rect
		config={{
			width: bgWidth,
			height: bgHeight,
			fill: 'rgba(0, 0, 0, 0.9)',
			stroke: 'white',
			strokeWidth: 2,
			cornerRadius: 8,
			perfectDrawEnabled: false,
			listening: false,
		}}
	/>

	<Group bind:handle={groupRef} config={{ offsetX: -bgPadding / 2, y: bgPadding / 2 }}>
		<Text
			config={{
				text: title,
				fill: 'white',
				fontSize: fontSize,
				listening: false,
				perfectDrawEnabled: false,
				textDecoration: descriptionLines.length > 0 ? 'underline' : 'none',
			}}
		/>

		{#each descriptionLines as descriptionLine, i}
			<Text
				config={{
					text: descriptionLine,
					fill: 'white',
					fontSize: fontSize * 0.75,
					y: (i + 1) * fontSize + lineHeight,
					listening: false,
					perfectDrawEnabled: false,
				}}
			/>
		{/each}
	</Group>
</Group>
