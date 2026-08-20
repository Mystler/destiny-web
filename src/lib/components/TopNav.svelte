<script lang="ts">
  import { resolve } from "$app/paths";
  import { slide } from "svelte/transition";
  import logo from "$lib/assets/logo.svg";
  import { page } from "$app/state";
</script>

<div transition:slide class="mb-6 flex justify-between border-b border-b-slate-500 bg-slate-950 px-4 py-2">
  <div class="menu flex items-center gap-8">
    <a href={resolve("/")} class="group flex items-center gap-2">
      <img src={logo} alt="Logo" class="w-16 not-group-hover:opacity-80" />
      <div class="font-semibold">DestinyURU</div>
    </a>
    <div class="hidden items-center gap-8 md:flex">
      <a href={resolve("/news")}>News</a>
      <a href={resolve("/news")}>News</a>
    </div>
  </div>
  <div class="menu flex items-center gap-8 text-right">
    {#if page.data.loggedIn}
      <div>
        Logged in as <a href={resolve("/(authenticated)/account")}>{page.data.loggedIn}</a><br />
        <a href={resolve("/logout")}>Logout</a>
      </div>
    {:else}
      <a href={resolve("/login")}>Login</a>
    {/if}
  </div>
</div>

<style lang="postcss">
  @reference "../../routes/layout.css";

  .menu > a {
    @apply transition-transform duration-200 ease-out;
  }

  .menu > a:hover {
    @apply scale-110;
  }
</style>
