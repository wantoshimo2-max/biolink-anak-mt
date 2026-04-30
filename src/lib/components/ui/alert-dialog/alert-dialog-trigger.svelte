<script lang="ts">
	import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

	let { ref = $bindable(null), child, children, ...restProps }: AlertDialogPrimitive.TriggerProps = $props();
</script>

<AlertDialogPrimitive.Trigger bind:ref data-slot="alert-dialog-trigger" {...restProps}>
	{#if child}
		{@render child({ props: restProps })}
	{:else}
		{@render children?.()}
	{/if}
</AlertDialogPrimitive.Trigger>
