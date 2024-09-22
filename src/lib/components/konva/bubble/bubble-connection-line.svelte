<script lang="ts">
	import Konva from 'konva';
	import type { LineConfig } from 'konva/lib/shapes/Line';
	import { onDestroy, onMount } from 'svelte';
	import { Line } from 'svelte-konva';

	let ref: Konva.Line | undefined;

	const defaultLineConfig: LineConfig = {
		stroke: 'rgba(0, 100, 0, 0.4)',
		strokeWidth: 2,
		listening: false,
	};

	export let line: LineConfig = {};

	const anim = new Konva.Animation((frame) => {
		if (ref === undefined || !frame) return;

		if (!ref.dashEnabled) return;
		const offset = frame.timeDiff / -10;
		ref.dashOffset((ref.dashOffset() + offset) % 100);
	});

	onMount(() => anim.start());
	onDestroy(() => anim.stop());
</script>

<Line bind:handle={ref} config={{ ...defaultLineConfig, ...line }} />
