<script lang="ts">
  import { asset } from "$app/paths";
  import ButtonLink from "$lib/components/ButtonLink.svelte";
  import Card from "$lib/components/Card.svelte";
</script>

<svelte:head>
  <title>DestinyURU How To Play</title>
  <meta name="description" content="Learn how to get a client that works to play on DestinyURU." />
</svelte:head>

<h1>How To Play</h1>

<div class="flex flex-col gap-2 p-1">
  <p>
    For DestinyURU, you are expected to bring your own client. As such, the shard has no fileserver or installer that
    will get all of the game files for you. However, you are not expected to know everything about URU clients, so there
    are two alternative ways of getting a client.
  </p>
  <div class="grid gap-2 md:grid-cols-2">
    <Card>
      <h3 id="get-uru">Using GetUru</h3>
      <p>
        With the help of the <a href="https://github.com/Hoikas/GetUru" target="_blank" rel="noopener">GetUru</a> script by
        Hoikas, you can get the latest H-uru client and assets for the game and play on Destiny with full automation. This
        is the best way to get started if you simply want to get online and/or test a fan age.
      </p>
      <p>
        The script is a PowerShell script for Windows. Just follow the instructions on the GitHub page and you should be
        ready to go!
      </p>
      <p>
        GetUru also has a shell script for other platforms. You can try using that via <code
          >./get_uru_client --destiny</code
        >. <code>--help</code> will provide information about other optional settings.
      </p>
      <p>
        GetUru effectively downloads the latest <a
          href="https://github.com/H-uru/Plasma/releases/tag/last-successful"
          target="_blank"
          rel="noopener">precompiled H-uru/Plasma client</a
        >, the game assets from
        <a href="https://github.com/H-uru/moul-assets" target="_blank" rel="noopener">H-uru/moul-assets</a>, and
        Destiny's <a href={asset("/server.ini")} download>server.ini</a>. Then, it creates a shortcut with the
        <code>/LocalData</code> option.
      </p>
      <p class="my-4 text-center">
        <ButtonLink href="https://github.com/Hoikas/GetUru" target="_blank" rel="noopener">GetUru</ButtonLink>
      </p>
    </Card>
    <Card>
      <h3 id="compile-client">Compile your own Client</h3>
      <p>
        If you don't use GetUru, then you will have to source and build the client yourself. This is the original "bring
        your own client" approach, intended for developers. Thus, if this is your intended option, I would assume you
        have basic familiarity with building Myst Online clients already.
      </p>
      <p>
        The recommended client for Destiny is any client that is based on the <a
          href="https://github.com/H-uru/Plasma"
          target="_blank"
          rel="noopener">H-uru/Plasma</a
        > fork. See that GitHub page for more information.
      </p>
      <p>The following additional points are required to play with a custom client:</p>
      <ul class="mb-2 list-inside list-disc">
        <li>
          In order for Destiny to not reject your client, the CMake product information (branch id, build id, build
          type, and uuid) has to match the default values.
        </li>
        <li>
          Since Destiny does not have a dataserver, you will have to launch the game with the <code>/LocalData</code> command-line
          argument. This will require you to build the client as an internal client (the default when building H-uru/Plasma).
        </li>
        <li>
          Lastly, you will need the correct <a href={asset("/server.ini")} download>server.ini</a> file for the Destiny shard.
        </li>
      </ul>
      <p>
        If you need to get the base game assets for your client, you can get them from the compiled folder in the <a
          href="https://github.com/H-uru/moul-assets"
          target="_blank"
          rel="noopener">H-uru/moul-assets</a
        > repository.
      </p>
    </Card>
  </div>
  <hr />
  <Card>
    <h3 id="tips">Tips & Tricks</h3>
    <p>Once you are on Destiny with an internal client, here are some things you might want to know:</p>
    <ul class="list-inside list-disc">
      <li>
        Destiny allows multiple logins on one account. Yes, if you want to test multiplayer elements, you do not need to
        register a second account. You can just launch a second client and select a different avatar.
      </li>
      <li>
        You can open a Plasma Developer Console using the Tilde <code>~</code> key on US keyboard layouts. This varies
        on other keyboard layouts. For German keyboards it is the <code>ö</code> key. Entering
        <code>Console.CreateBriefDocumentation docs.html</code> will create a docs.html file in your client folder with a
        documentation for available commands. Use them carefully and at your own risk if you do not understand them.
      </li>
      <li>
        For age testers, the most useful console commands will be <code>Net.LinkWithOriginalBook</code> to go to a
        persistent personal instance of your age or <code>Net.LinkToAge</code> for a temporary instance. It is not recommended
        to use Net.LinkToAge with original Cyan ages, but note that linking to original ages with console commands is generally
        subject to quirks because of how the game's scripts customize linking rules for various circumstances. If you want
        original behavior for an original age, you should use the original way of getting there.
      </li>
      <li>
        You can go to another player's age by using <code>Net.LinkToPlayersAge</code> with their KI number. This should be
        useful when wanting to test your fan age in multiplayer as well; just make sure to actually give the other player
        your age files.
      </li>
      <li>
        A <code>/party</code> chat command might be set up to go to the original Destiny neighborhood. It can also be set
        to go to other places for easy meet ups.
      </li>
      <li>
        If your login is already saved properly in the client and you don't want to go through the launcher process
        every time or see the intro videos, the command line options <code>/SkipLoginDialog</code> and
        <code>/SkipIntroMovies</code>
        may be of interest to you. Just add them alongside <code>/LocalData</code> to your shortcut.
      </li>
      <li>
        You can also set the launch arguments <code>/PlayerId</code> with your KI number and
        <code>/Age</code> with an age name to start directly in an age of your choice. Example:
        <code>/PlayerId 12345 /Age Personal</code>
      </li>
    </ul>
  </Card>
</div>
