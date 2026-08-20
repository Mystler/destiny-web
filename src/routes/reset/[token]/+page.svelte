<script lang="ts">
  import { resolve } from "$app/paths";
  import ButtonLink from "$lib/components/ButtonLink.svelte";

  let { form } = $props();
</script>

<svelte:head>
  <title>DestinyURU Reset Password</title>
  <meta name="description" content="Reset your password for DestinyURU." />
</svelte:head>

<h1>Reset Your Password</h1>

<form method="POST" class="flex flex-col items-center gap-2 text-left">
  <label>
    New Password:<br />
    <input type="password" name="password" required />
  </label>
  <label>
    Confirm Password:<br />
    <input type="password" name="password_confirm" required />
  </label>
  {#if form?.missing}
    <p class="error">All fields need to be filled out!</p>
  {/if}
  {#if form?.passwordMismatch}
    <p class="error">Your password confirmation did not match!</p>
  {/if}
  {#if form?.passwordTooLong}
    <p class="error">Sorry, URU only supports password up to 15 characters in length!</p>
  {/if}
  {#if form?.fail}
    <p class="error">Your password could not be set!</p>
  {/if}
  <input type="submit" />
</form>
