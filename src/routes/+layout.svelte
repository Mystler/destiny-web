<script lang="ts">
  import "./layout.css";
  import logo from "$lib/assets/logo.svg";
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import TopNav from "$lib/components/TopNav.svelte";

  let { children } = $props();

  onNavigate((navigation) => {
    if (!document.startViewTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<svelte:head>
  <link rel="icon" href={logo} />
</svelte:head>

<!-- HEADER -->
{#if page.route.id !== "/"}
  <TopNav />
{/if}

<div class="mx-auto max-w-(--breakpoint-xl) text-center">
  {@render children()}
</div>
