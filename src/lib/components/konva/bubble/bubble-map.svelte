<script lang="ts">
	import type Konva from 'konva';
	import { onMount, tick, type ComponentProps } from 'svelte';
	import { Stage, Layer, Line } from 'svelte-konva';
	import BubbleGroup from './bubble-group.svelte';
	import Bubble from './bubble.svelte';
	import { activeBubbleTitle } from '$lib/stores/active-bubble';

	export let items: Omit<ComponentProps<Bubble | BubbleGroup>, 'x' | 'y'>[] = [];

	const isBubble = (v: (typeof items)[number]): v is Omit<ComponentProps<Bubble>, 'x' | 'y'> =>
		v.hasOwnProperty('title');

	const isGroup = (v: (typeof items)[number]): v is Omit<ComponentProps<BubbleGroup>, 'x' | 'y'> =>
		!v.hasOwnProperty('title');

	let stageRef: Konva.Stage | undefined;

	export let x = 0;
	export let y = 0;
	export let height;
	export let width;
	$: maxExtraDragX = width;

	const offsetStagePanCoords = (x: number, y: number) => ({ x: x + width / 2, y: y + height / 2 });

	const getNeededDiameter = (radius: number) => radius * 6;

	const getDist = (v1: { x: number; y: number }, v2: { x: number; y: number }) =>
		Math.sqrt(Math.pow(Math.abs(v1.x - v2.x), 2) + Math.pow(Math.abs(v1.y - v2.y), 2));

	const generatePositions = (items: { radius: number }[], width: number) => {
		const positions: { x: number; y: number }[] = [];

		let runningX = 0;
		let runningY = 0;

		const isCloseToAny = (vec: { x: number; y: number }, diameter: number) => {
			return positions.some((v, i) => getDist(vec, v) < diameter + getNeededDiameter(items[i].radius));
		};

		for (let i = 0; i < items.length; i++) {
			const item = items[i];

			const diameter = getNeededDiameter(item.radius);

			const lastItemDiameter = i === 0 ? 0 : getNeededDiameter(items[i - 1].radius);
			const minDistFromLast = diameter + lastItemDiameter;

			const maxRight = width - diameter / 2;

			let placement = { x: Math.max(diameter, runningX), y: Math.max(diameter, runningY) };
			do {
				placement.x = placement.x + diameter / 2;

				if (placement.x >= maxRight) {
					placement.x = diameter * 1.5;
					placement.y = placement.y + diameter;

					if (placement.x >= maxRight || diameter >= width) {
						placement.x = width / 2;
						break;
					}
				}
			} while (isCloseToAny(placement, minDistFromLast) || placement.x >= maxRight);

			runningX = placement.x;
			runningY = placement.y;

			positions.push(placement);
		}

		return positions;
	};

	$: itemPositions = generatePositions(items, width);

	let bubbleNavigationTarget: number | undefined = undefined;

	const autoSelectBubble = (index: number | undefined) => {
		if (!stageRef) return;

		if (index === undefined || index < 0 || index >= items.length) {
			activeBubbleTitle.set(undefined);
			return;
		}

		const target = items[index];
		if (isBubble(target)) activeBubbleTitle.set(target.title);
		else activeBubbleTitle.set(undefined);

		const targetPos = itemPositions[index];
		if (targetPos) stageRef.to({ ...offsetStagePanCoords(-targetPos.x, -targetPos.y), duration: 0.25 });
	};

	const handleWheel = (e: WheelEvent) => {
		if (!stageRef) return;

		if (stageRef.isDragging()) return;
		bubbleNavigationTarget ??= -1;

		if (e.deltaY < 0) bubbleNavigationTarget--;
		else if (e.deltaY > 0) bubbleNavigationTarget++;

		if (bubbleNavigationTarget !== undefined)
			bubbleNavigationTarget = Math.max(0, Math.min(bubbleNavigationTarget, items.length - 1));
	};

	$: autoSelectBubble(bubbleNavigationTarget);

	onMount(async () => {
		await tick();
		bubbleNavigationTarget = 0;
	});
</script>

<Stage
	bind:handle={stageRef}
	config={{
		width: width,
		height: height,
		draggable: true,
		x: x,
		y: y,
	}}
	on:dragmove={() => stageRef?.x(Math.min(maxExtraDragX, Math.max(-maxExtraDragX, stageRef.x())))}
	on:wheel={(e) => handleWheel(e.detail.evt)}
>
	<Layer config={{ listening: false }}>
		{#each itemPositions as { x, y }, i}
			{#if i < itemPositions.length - 1}
				<Line
					config={{
						points: [x, y, itemPositions[i + 1].x, itemPositions[i + 1].y],
						stroke: 'rgba(0, 100, 0, 0.3)',
						strokeWidth: 2,
						dash: [10, 10],
					}}
				/>
			{/if}
		{/each}
	</Layer>

	{#each items as item, i}
		{#if isGroup(item)}
			<Layer>
				<BubbleGroup {...item} x={itemPositions[i].x} y={itemPositions[i].y} />
			</Layer>
		{/if}
	{/each}

	<Layer>
		{#each items as item, i}
			{#if isBubble(item)}
				<Bubble {...item} x={itemPositions[i].x} y={itemPositions[i].y} />
			{/if}
		{/each}
	</Layer>
</Stage>
