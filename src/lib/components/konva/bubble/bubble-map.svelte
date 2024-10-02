<script lang="ts">
	import Konva from 'konva';
	import { createEventDispatcher, onMount, tick, type ComponentProps } from 'svelte';
	import { Stage, Layer, Line } from 'svelte-konva';
	import BubbleGroup from './bubble-group.svelte';
	import Bubble from './bubble.svelte';
	import { activeBubbleTitle } from '$lib/stores/active-bubble';
	import BubbleConnectionLine from './bubble-connection-line.svelte';
	import { throttled } from '$lib/util/throttled';

	type BubbleProps = Omit<ComponentProps<Bubble>, 'x' | 'y'>;
	type GroupProps = Omit<ComponentProps<BubbleGroup>, 'x' | 'y'>;
	type Item = BubbleProps | GroupProps;
	type Position = { x: number; y: number };
	type NavigateDirection = 1 | -1;

	const NAV_DOWN: NavigateDirection = 1;
	const NAV_UP: NavigateDirection = -1;

	const isBubble = (v: (typeof items)[number]): v is BubbleProps => v.hasOwnProperty('title');
	const isGroup = (v: (typeof items)[number]): v is GroupProps => !v.hasOwnProperty('title');

	const emit = createEventDispatcher();

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

	let hasDragged = false;
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

		hasDragged = false;
		stageRef.to({
			duration: 0.35,
			...offsetStagePanCoords(-targetPos.x, -targetPos.y),
		});
	};

	let itemNavigationTarget: number | undefined = undefined;
	$: gotoItem(itemNavigationTarget);

	const targetNextItem = (direction: NavigateDirection) => {
		let newTarget = (itemNavigationTarget ?? 0) + direction;
		newTarget = Math.max(0, Math.min(newTarget, items.length - 1));
		itemNavigationTarget = newTarget;
	};

	const targetClosestItem = () => {
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

	const autoNavigateInDirection = (direction: NavigateDirection) => {
		if (!hasDragged) targetNextItem(direction);
		else targetClosestItem();
	};

	const handleWheel = throttled(250, (e: WheelEvent) => {
		if (!stageRef) return;
		if (stageRef.isDragging()) return;
		autoNavigateInDirection(e.deltaY < 0 ? NAV_UP : NAV_DOWN);
	});

	const handleKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'ArrowUp') autoNavigateInDirection(NAV_UP);
		else if (e.key === 'ArrowDown') autoNavigateInDirection(NAV_DOWN);
	};

	const handleBubbleClick = (clickedBubble: BubbleProps) => emit('click', clickedBubble);

	$: itemNavigationTarget !== undefined && gotoItem(itemNavigationTarget);

	onMount(async () => {
		await tick();
		setTimeout(() => {
			if (!hasDragged) itemNavigationTarget = 0;
		}, 1000);
	});
</script>

<svelte:window on:keyup={handleKeyPress} />

<Stage
	bind:handle={stageRef}
	config={{
		width: width,
		height: height,
		draggable: true,
	}}
	on:mouseup={(e) => {
		// Immitate the back button since Konva swallows the mouse event

		const mouseButton = e.detail.evt.button;
		if (mouseButton === 3) {
			e.stopPropagation();
			history.back();
		} else if (mouseButton === 4) {
			e.stopPropagation();
			history.forward();
		}
	}}
	on:dragmove={() => {
		hasDragged = true;
		stageRef?.x(Math.min(maxExtraDragX, Math.max(-maxExtraDragX, stageRef.x())));
	}}
	on:wheel={(e) => handleWheel(e.detail.evt)}
>
	<Layer config={{ listening: false }}>
		{#each itemPositions as { x, y }, i}
			{#if i < itemPositions.length - 1}
				<BubbleConnectionLine
					line={{
						points: [x, y, itemPositions[i + 1].x, itemPositions[i + 1].y],
						dash: [10, 10],
					}}
				/>
			{/if}
		{/each}
	</Layer>

	<Layer>
		{#each items as item, i}
			{#if isGroup(item)}
				<BubbleGroup
					on:click={(v) => handleBubbleClick(v.detail)}
					{...item}
					x={itemPositions[i].x}
					y={itemPositions[i].y}
				/>
			{:else}
				<Bubble
					on:click={() => handleBubbleClick(item)}
					{...item}
					x={itemPositions[i].x}
					y={itemPositions[i].y}
				/>
			{/if}
		{/each}
	</Layer>
</Stage>
