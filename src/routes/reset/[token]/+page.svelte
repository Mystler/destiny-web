<script lang="ts">
  import { setNewPassword } from "./reset.remote";
</script>

<svelte:head>
  <title>DestinyURU Reset Password</title>
  <meta name="description" content="Reset your password for DestinyURU." />
</svelte:head>

<h1>Reset Your Password</h1>

<form class="flex flex-col items-center gap-2 text-left" {...setNewPassword}>
  <label>
    New Password:<br />
    <input required {...setNewPassword.fields._new_password.as("password")} />
  </label>
  <label>
    Confirm Password:<br />
    <input required {...setNewPassword.fields._password_confirm.as("password")} />
  </label>
  {#each setNewPassword.fields.allIssues() as issue (issue.path)}
    <p class="error">{issue.message}</p>
  {/each}
  {#if setNewPassword.result?.error}
    <p class="error">{setNewPassword.result.error}</p>
  {/if}
  <input type="submit" />
</form>
