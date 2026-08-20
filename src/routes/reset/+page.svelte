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
    {#if form?.missing}
      <p class="error">All fields need to be filled out!</p>
    {/if}
    {#if form?.invalidEmail}
      <p class="error">Invalid e-mail format!</p>
    {/if}
    {#if form?.fail}
      <p class="error">Could not begin reset procedures. The specified e-mail address may not exist.</p>
    {/if}
    {#if form?.captchaFailed}
      <p class="error">You could not be verified by against bot protections... Shame...</p>
    {/if}
    <input type="submit" />
  {:else}
    <p>You have been sent an e-mail with instructions to reset your password!</p>
  {/if}
</form>
