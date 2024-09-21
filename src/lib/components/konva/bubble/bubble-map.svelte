<script lang="ts">
	import Konva from 'konva';
	import { onMount, tick, type ComponentProps } from 'svelte';
	import { Stage, Layer, Line } from 'svelte-konva';
	import BubbleGroup from './bubble-group.svelte';
	import Bubble from './bubble.svelte';
	import { activeBubbleTitle } from '$lib/stores/active-bubble';

	type BubbleProps = Omit<ComponentProps<Bubble>, 'x' | 'y'>;
	type GroupProps = Omit<ComponentProps<BubbleGroup>, 'x' | 'y'>;
	type Item = BubbleProps | GroupProps;
	type Position = { x: number; y: number };

	const isBubble = (v: (typeof items)[number]): v is BubbleProps => v.hasOwnProperty('title');
	const isGroup = (v: (typeof items)[number]): v is GroupProps => !v.hasOwnProperty('title');

	let stageRef: Konva.Stage | undefined;

	export let items: Item[] = [];
	export let height;
	export let width;
	$: maxExtraDragX = width;

	const offsetStagePanCoords = (x: number, y: number) => ({ x: x + width / 2, y: y + height / 2 });

	const getNeededDiameter = (radius: number) => radius * 6;
	const getDist = (v1: Position, v2: Position) =>
		Math.sqrt(Math.pow(Math.abs(v1.x - v2.x), 2) + Math.pow(Math.abs(v1.y - v2.y), 2));

	const generatePositions = (items: { radius: number }[], width: number) => {
		const positions: Position[] = [];

		let runningX = 0;
		let runningY = 0;

		const isCloseToAny = (vec: Position, diameter: number) => {
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

	let itemPositions: Position[] = [];
	$: {
		itemPositions = generatePositions(items, width);
		const target = itemNavigationTarget;
		if (target !== undefined) gotoItem(target);
	}

	let itemNavigationTarget: number | undefined = undefined;
	let hasMovedSinceLastAutoTarget = false;
	const gotoItem = (index: number | undefined) => {
		if (!stageRef) return;

		if (index === undefined || index < 0 || index >= items.length) {
			activeBubbleTitle.set(undefined);
			return;
		}

		const target = items[index];
		if (isBubble(target)) activeBubbleTitle.set(target.title);
		else activeBubbleTitle.set(undefined);

		const targetPos = itemPositions[index];

		hasMovedSinceLastAutoTarget = false;
		stageRef.to({
			duration: 0.25,
			...offsetStagePanCoords(-targetPos.x, -targetPos.y),
		});
	};

	$: gotoItem(itemNavigationTarget);

	const targetNextItem = (direction: 1 | -1) => {
		let newTarget = (itemNavigationTarget ?? 0) + direction;
		newTarget = Math.max(0, Math.min(newTarget, items.length - 1));
		itemNavigationTarget = newTarget;
	};

	const autoGotoItem = (direction: 1 | -1) => {
		if (!hasMovedSinceLastAutoTarget) return targetNextItem(direction);
		if (!stageRef) return;

		const stageCenter = {
			x: -stageRef.x() + stageRef.width() / 2,
			y: -stageRef.y() + stageRef.height() / 2,
		};

		let closestIndex = itemNavigationTarget ?? 0;
		let minDistance = Infinity;
		for (let i = 0; i < items.length; i++) {
			const pos = itemPositions[i];
			const dist = getDist(stageCenter, pos);
			if (dist > minDistance) continue;

			minDistance = dist;
			closestIndex = i;
		}

		itemNavigationTarget = undefined;
		itemNavigationTarget = closestIndex;
	};

	const handleWheel = (e: WheelEvent) => {
		if (!stageRef) return;
		if (stageRef.isDragging()) return;
		autoGotoItem(e.deltaY < 0 ? -1 : 1);
	};

	$: itemNavigationTarget !== undefined && gotoItem(itemNavigationTarget);

	onMount(async () => {
		await tick();
		itemNavigationTarget = 0;
	});
</script>

<Stage
	bind:handle={stageRef}
	config={{
		width: width,
		height: height,
		draggable: true,
	}}
	on:dragmove={() => {
		hasMovedSinceLastAutoTarget = true;
		stageRef?.x(Math.min(maxExtraDragX, Math.max(-maxExtraDragX, stageRef.x())));
	}}
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
						listening: false,
					}}
				/>
			{/if}
		{/each}
	</Layer>

	<Layer>
		{#each items as item, i}
			{#if isGroup(item)}
				<BubbleGroup {...item} x={itemPositions[i].x} y={itemPositions[i].y} />
			{:else}
				<Bubble {...item} x={itemPositions[i].x} y={itemPositions[i].y} />
			{/if}
		{/each}
	</Layer>
</Stage>
