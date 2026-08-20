<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import banner from "$lib/assets/DestinyBanner.webp";
  import logo from "$lib/assets/logo.svg";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
</script>

<svelte:head>
  <title>DestinyURU</title>
  <meta
    name="description"
    content="The experimental Myst Online: URU Live Testing Shard that lets you bring your own client."
  />
</svelte:head>

<div class="@container relative">
  <img
    class="absolute -z-1 h-full w-full object-cover opacity-100 blur-xs transition-opacity duration-2000 sm:object-contain starting:opacity-0"
    src={banner}
    alt="DestinyURU Banner"
  />
  <div class="flex min-h-[55.57cqw] flex-col justify-center gap-4">
    <div class="mt-8 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8">
      <img src={logo} class="max-w-16 sm:max-w-32 lg:max-w-48" alt="Logo" />
      <div class="text-3xl font-bold text-amber-400 text-shadow-[0_0_30px_black] sm:text-5xl">DestinyURU</div>
    </div>
    <div class="font-semibold text-balance text-amber-200 text-shadow-[0_0_10px_black]">
      A Myst Online: URU Live Testing Shard!
    </div>
    <div class="my-16 flex flex-wrap items-center justify-center gap-2">
      {#if page.data.loggedIn}
        <ButtonLink href={resolve("/(authenticated)/account")}>My Account</ButtonLink>
        <ButtonLink href={resolve("/(authenticated)/age-upload")}>Age Uploader</ButtonLink>
      {:else}
        <ButtonLink href={resolve("/signup")}>Sign Up</ButtonLink>
        <ButtonLink href={resolve("/login")}>Login</ButtonLink>
      {/if}
      <ButtonLink href={resolve("/news")}>News</ButtonLink>
    </div>
  </div>
</div>

<h1>What is DestinyURU?</h1>
<p>This is where content goes. Wheee!</p>
