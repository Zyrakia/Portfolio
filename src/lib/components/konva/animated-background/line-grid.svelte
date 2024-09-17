<script lang="ts">
	import type Konva from 'konva';
	import { Line } from 'svelte-konva';

	export let rows: number;
	export let cols: number;
	export let width: number;
	export let height: number;
	export let config: Omit<Konva.LineConfig, 'points'> = { stroke: 'darkgreen', strokeWidth: 1 };

	$: rowStartYPoints = Array.from({ length: rows - 1 }, (_, i) => (height / rows) * (i + 1));
	$: colStartXPoints = Array.from({ length: cols - 1 }, (_, i) => (width / cols) * (i + 1));
</script>

{#each rowStartYPoints as y, _}
	<Line
		config={{
			...config,
			points: [0, y, width, y],
		}}
	/>
{/each}

{#each colStartXPoints as x, _}
	<Line
		config={{
			...config,
			points: [x, 0, x, height],
		}}
	/>
{/each}
