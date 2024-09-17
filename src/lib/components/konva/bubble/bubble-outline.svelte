<script lang="ts">
	import Konva from 'konva';
	import { onDestroy, onMount, tick } from 'svelte';
	import { Circle } from 'svelte-konva';
	import { spring } from 'svelte/motion';

	let ref: Konva.Circle | undefined;

	export let radius;
	export let active = false;
	export let level = 0;
	export let color = 'rgba(100, 255, 100, 0.4)';

	let strokeWidth = 1;

	let strokeGrowth = spring(0);
	$: if (active) strokeGrowth.set(1 * (level * 0.4));
	else strokeGrowth.set(0, { soft: true });

	let opacity = spring(0);
	$: if (active) opacity.set(1);
	else opacity.set(0);

	let rotation = 0;
	let konvaAnim: Konva.Animation | undefined;
	$: if (active) konvaAnim?.start();
	else konvaAnim?.stop();

	onMount(async () => {
		await tick();
		konvaAnim = new Konva.Animation((frame) => {
			if (!frame) return;
			rotation = (rotation + frame.timeDiff / 8) % 360;
		}, ref!.getLayer());
	});

	onDestroy(() => (konvaAnim = undefined));
</script>

<Circle
	bind:handle={ref}
	config={{
		radius: radius * (1 + $strokeGrowth) - level * 5 + strokeWidth,
		rotation: level % 2 === 0 ? rotation : -rotation,
		stroke: color,
		strokeWidth: strokeWidth,
		dash: level === 0 ? undefined : [50, 25],
        opacity: level === 0 ? 1 : $opacity,
		listening: false,
		perfectDrawEnabled: false,
	}}
/>
