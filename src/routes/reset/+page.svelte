<script lang="ts">
  import { PUBLIC_RECAPTCHA_SITE_KEY } from "$env/static/public";

  let { form } = $props();
</script>

<svelte:head>
  <title>DestinyURU Reset Password</title>
  <meta name="description" content="Reset your password for DestinyURU." />
  <script src="https://www.google.com/recaptcha/enterprise.js" async defer></script>
</svelte:head>

<h1>Reset Your Password</h1>

<form method="POST" class="flex flex-col items-center gap-2 text-left">
  {#if !form?.success}
    <label>
      E-Mail Address:<br />
      <input type="email" name="email" required />
    </label>
    <div class="g-recaptcha" data-sitekey={PUBLIC_RECAPTCHA_SITE_KEY} data-action="RESET"></div>
    {#each form?.issues as issue (issue.path)}
      <p class="error">{issue.message}</p>
    {/each}
    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
    <input type="submit" />
  {:else}
    <p>You have been sent an e-mail with instructions to reset your password!</p>
  {/if}
</form>
