<script lang="ts">
	import type { Vector2d } from 'konva/lib/types';
	import { Group, Text } from 'svelte-konva';
	import { spring } from 'svelte/motion';
	import AutoSizedBackground from '../auto-sized-background.svelte';
	import { wrapString } from '$lib/util/wrap-string';

	export let title: string;
	export let description: string | undefined = undefined;
	export let active = false;
	export let offset: Vector2d = { x: 0, y: 0 };
	export let fontSize = 20;
	export let lineHeight = 6;
	export let lineWidth = 40;

	$: descriptionLines = description === undefined ? [] : wrapString(description, lineWidth);

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
			fill: 'rgba(0, 0, 0, 1)',
			stroke: 'white',
			strokeWidth: 2,
			cornerRadius: 8,
			perfectDrawEnabled: false,
			listening: false,
		}}
	>
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

		{#if descriptionLines.length > 0}
			{#each descriptionLines as descriptionLine, i}
				<Text
					config={{
						text: descriptionLine,
						fill: 'white',
						fontSize: fontSize * 0.75,
						y: (i + 1) * fontSize + lineHeight + (i === 0 ? lineHeight / 2 : 0),
						listening: false,
						perfectDrawEnabled: false,
					}}
				/>
			{/each}
		{/if}
	</AutoSizedBackground>
</Group>
