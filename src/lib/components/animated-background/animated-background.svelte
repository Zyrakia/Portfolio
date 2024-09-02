<script lang="ts">
	import { Layer, Stage } from 'svelte-konva';
	import Vignette from './vignette.svelte';
	import LineGrid from './line-grid.svelte';
	import { tweened } from 'svelte/motion';
	import { onDestroy, onMount } from 'svelte';
	import { setIntervalRandom } from '$lib/util/set-interval-random';

	let height = window.innerHeight;
	let width = window.innerWidth;
	const resize = () => {
		height = window.innerHeight;
		width = window.innerWidth;
	};

	$: minRows = 10
	$: minCols = 10
	const tickInterval = 2000;
	const tickRandom = 500;

	let rows = tweened(0, { duration: tickInterval / 2 });
	let cols = tweened(0, { duration: tickInterval / 2 });

	let clearRowsInterval: Function | undefined;
	let clearColsInterval: Function | undefined;

	const rand = (min: number, max: number) => Math.random() * (max - min) + min;
	const tickRows = () => ($rows > 0 ? rows.set(0) : rows.set(rand(minRows, minRows)));
	const tickCols = () => ($cols > 0 ? cols.set(0) : cols.set(rand(minCols, minCols)));

	onMount(() => {
		window.addEventListener('resize', resize);

		tickRows();
		tickCols();
		clearRowsInterval = setIntervalRandom(tickRows, tickInterval, tickInterval + tickRandom);
		clearColsInterval = setIntervalRandom(tickCols, tickInterval, tickInterval + tickRandom);
	});

	onDestroy(() => {
		window.removeEventListener('resize', resize);

		clearRowsInterval?.();
		clearRowsInterval = undefined;
		rows.set(0);

		clearColsInterval?.();
		clearColsInterval = undefined;
		cols.set(0);
	});
</script>

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
				config={{ stroke: 'rgba(0, 100, 0, 0.1)', strokeWidth: 1 }}
			/>
		</Layer>

		<Layer>
			<Vignette {width} {height} color="darkgreen" blur={1.8} />
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
