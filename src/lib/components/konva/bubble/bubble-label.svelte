<script lang="ts">
	import type { Vector2d } from 'konva/lib/types';
	import { Group, Text } from 'svelte-konva';
	import { spring } from 'svelte/motion';
	import AutoSizedBackground from '../auto-sized-background.svelte';
	import { wrapString } from '$lib/util/wrap-string';

	export let title: string;
	export let description: string | string[] = [];
	export let active = false;
	export let offset: Vector2d = { x: 0, y: 0 };
	export let fontSize = 20;
	export let lineHeight = 6;
	export let lineWidth = 40;

	$: descriptionLines = Array.isArray(description) ? description : wrapString(description, lineWidth);

	const labelOpacity = spring(0);
	const labelOffsetX = spring(0);
	const labelOffsetY = spring(0);

	$: if (active) {
		labelOffsetY.set(offset.y);
		labelOpacity.set(1);
	} else {
		labelOffsetY.set(0);
		labelOpacity.set(0);
	}

	const labelPadding = 20;
	let labelWidth = 0;
	let labelHeight = 0;

	$: labelOffsetX.set(labelWidth / 2 + offset.x);
</script>

<Group config={{ offsetX: $labelOffsetX + offset.x, offsetY: $labelOffsetY, opacity: $labelOpacity }}>
	<AutoSizedBackground
		on:update={({ detail: { width, height } }) => {
			labelWidth = width;
			labelHeight = height;
		}}
		padding={labelPadding}
		bg={{
			fill: 'rgba(0, 0, 0, 0.9)',
			stroke: 'white',
			strokeWidth: 2,
			cornerRadius: 8,
			perfectDrawEnabled: false,
			listening: false,
		}}
	>
		<Group config={{ offsetX: -labelPadding / 2, y: labelPadding / 2 }}>
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
	</AutoSizedBackground>
</Group>
