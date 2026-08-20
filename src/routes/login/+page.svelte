<script lang="ts">
  import { resolve } from "$app/paths";

  let { form } = $props();
</script>

<svelte:head>
  <title>DestinyURU Login</title>
  <meta name="description" content="Log into your account for DestinyURU." />
</svelte:head>

<h1>Login to DestinyURU</h1>

<form method="POST" class="flex flex-col items-center gap-2 text-left">
  <label>
    Username:<br />
    <input type="text" name="login" value={form?.login ?? ""} required />
  </label>
  <label>
    Password:<br />
    <input type="password" name="password" required />
  </label>
  {#if form?.missing}
    <p class="error">All fields need to be filled out!</p>
  {/if}
  {#if form?.fail}
    <p class="error">Login failed!</p>
  {/if}
  {#if form?.banned}
    <p class="error">This account was banned!</p>
  {/if}
  <p class="text-center">
    <a href={resolve("/signup")} class="link-btn">I need an account</a><br />
    <a href={resolve("/reset")} class="link-btn">I forgot my password</a>
  </p>
  <input type="submit" />
</form>
