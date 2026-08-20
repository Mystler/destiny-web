<script lang="ts">
  import type { SvelteHTMLElements } from "svelte/elements";

  let { children, ...rest }: SvelteHTMLElements["a"] = $props();
</script>

<a {...rest}>
  {@render children?.()}
</a>

<style lang="postcss">
  @reference "../../routes/layout.css";

  a {
    @apply rounded-xl bg-amber-400 px-4 py-3 font-semibold text-slate-900 hover:bg-amber-300;
  }
</style>
