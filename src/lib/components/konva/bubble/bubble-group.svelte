<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Bubble from './bubble.svelte';
	import { Group, Text } from 'svelte-konva';
	import AutoSizedBackground from '../auto-sized-background.svelte';

	export let radius: number;
	export let x: number;
	export let y: number;

	let activeBubble: number | undefined = undefined;

	export let groupName: string = '';
	export let bubbles: Omit<ComponentProps<Bubble>, 'x' | 'y' | 'radius'>[];

	$: bubbleRadius = radius / (bubbles.length * 0.75);
	export function getBubblePosition(index: number) {
		const angle = (index * Math.PI * 2) / bubbles.length;
		return {
			x: Math.cos(angle) * (radius - bubbleRadius),
			y: Math.sin(angle) * (radius - bubbleRadius),
		};
	}

	$: placedBubbles = bubbles.map((v, i) => {
		const { x, y } = getBubblePosition(i);

		return {
			...v,
			radius: bubbleRadius,
			x: x,
			y: y,
		};
	});

	let labelWidth = 0;
	let labelHeight = 0;
	const updateLabelSize = (width: number, height: number) => {
		labelWidth = width;
		labelHeight = height;
	};
</script>

<Group config={{ x, y }}>
	<Group config={{ offsetX: labelWidth / 2, offsetY: labelHeight / 2 }}>
		<AutoSizedBackground
			bg={{
				fill: 'darkgreen',
				cornerRadius: 5,
				shadowEnabled: true,
				shadowColor: 'darkgreen',
				shadowBlur: 25,
				perfectDrawingEnabled: false,
				listening: false,
			}}
			padding={15}
			on:update={({ detail: { width, height } }) => updateLabelSize(width, height)}
		>
			<Text
				config={{ text: groupName, fontFamily: 'monospace', fill: 'white', fontSize: radius * 0.1 }}
			/>
		</AutoSizedBackground>
	</Group>

	{#each placedBubbles as bubble, i}
		<Bubble
			{...bubble}
			opacity={activeBubble === undefined || activeBubble === i ? 1 : 0.1}
			on:toggle={({ detail: active }) => {
				if (active) activeBubble = i;
				else if (activeBubble === i) activeBubble = undefined;
			}}
		/>
	{/each}
</Group>
