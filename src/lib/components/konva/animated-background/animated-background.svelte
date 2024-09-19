<script lang="ts">
	import { Layer, Stage } from 'svelte-konva';
	import Vignette from './vignette.svelte';
	import LineGrid from './line-grid.svelte';
	import { tweened } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { setIntervalRandom } from '$lib/util/set-interval-random';
	import { randInt } from '$lib/util/rand';

	let height = window.innerHeight;
	let width = window.innerWidth;
	const resize = () => {
		height = window.innerHeight;
		width = window.innerWidth;
	};

	let minRows = 10;
	let minCols = 10;
	const tickInterval = 2000;
	const tickRandom = 1000;

	let rows = tweened(0, { duration: tickInterval / 2 });
	let cols = tweened(0, { duration: tickInterval / 2 });

	let clearRowsInterval: Function | undefined;
	let clearColsInterval: Function | undefined;

	const tickRows = () => ($rows > 0 ? rows.set(0) : rows.set(randInt(minRows, minRows) + 10));
	const tickCols = () => ($cols > 0 ? cols.set(0) : cols.set(randInt(minCols, minCols + 10)));

	onMount(() => {
		tickRows();
		tickCols();
		clearRowsInterval = setIntervalRandom(tickRows, tickInterval, tickInterval + tickRandom);
		clearColsInterval = setIntervalRandom(tickCols, tickInterval, tickInterval + tickRandom);
	});

	onDestroy(() => {
		clearRowsInterval?.();
		clearRowsInterval = undefined;
		rows.set(0);

		clearColsInterval?.();
		clearColsInterval = undefined;
		cols.set(0);
	});
</script>

<svelte:window on:resize={resize} />

<div class="konva-wrapper">
	<Stage
		config={{
			listening: false,
			width: width,
			height: height,
		}}
	>
		<Layer>
			<LineGrid
				rows={Math.floor($rows)}
				cols={Math.floor($cols)}
				{width}
				{height}
				config={{ stroke: 'rgba(0, 100, 0, 0.2)', strokeWidth: 3 }}
			/>
		</Layer>

		<Layer>
			<Vignette {width} {height} color="darkgreen" blur={1.25} />
		</Layer>
	</Stage>
</div>

<style>
	.konva-wrapper {
		z-index: -1;
		position: absolute;
		left: 0;
		top: 0;
	}
</style>
