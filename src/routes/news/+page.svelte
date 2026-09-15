<script>
  import Card from "$lib/components/Card.svelte";
</script>

<svelte:head>
  <title>DestinyURU News</title>
  <meta name="description" content="The latest news about the DestinyURU Shard." />
</svelte:head>

<h1>News</h1>

<div class="flex flex-col gap-2 p-1">
  <Card date="2026-09-14 | Mystler">
    <p>
      Two days ago, I had to update the Personal.sdl file for Relto to a new version so it is compatible with modern
      testing for adding new Relto pages. The file used to be an older one from TOC testing that was only supporting 30
      pages. Alas, the dirtsand server didn't like that version upgrade and lost data in migration, which means
      everyone's Relto has reset to the original default state. My apologies for the inconvencience. You may have to
      re-do some personal unlocks for it if you care about them. Things that are not stored in the SDL, like your
      unlocked books in the shelf (aside from the Cleft), will still work fine.
    </p>
    <p>
      If you want to get things back more quickly, console commands can help with that. To get all Relto pages you can
      open the console and run <code>Python.Cheat GetAllYeeshaPages 1</code>. I also have a pending pull request to
      H-uru/master that will add
      <code>Python.Cheat GetAllBahroWedges 1</code>
      and <code>Python.Cheat GetAllCalendarStones 1</code> as well in a future client version.
    </p>
    <p>
      <b>UPDATE (2026-09-15):</b> I have fixed the underlying bug in dirtsand. If you haven't logged in during the time period
      between the updated SDL file and the fix, then your Relto should migrate without losing data now.
    </p>
  </Card>
  <Card date="2026-08-21 | Mystler">
    <p>Hi! Welcome to the new website for Destiny!</p>
    <p>
      I have taken some time to create a new website. The old forum was overkill for simply offering registration
      services and information to play. Discussion was not really happening much and tends to work better on services
      like Discord. The forum also came with a lot of fighting AI crawlers that love phpbb giving them so many links to
      scrape, with and - more often - without consent.
    </p>
    <p>
      Since I recently returned to be more active in URU again, I decided to remake the Destiny website. All of your
      accounts have been ensured to work seamlessly with the new site. (As long as your account was ever registered with
      the shard itself. There were some forum accounts that never logged in again to have their actual server account
      created, so if you happen to be one of them, you will need to register again.)
    </p>
    <p>
      I will likely continue to make some changes to this site but it is now ready in the sense that it offers all the
      information needed to play, account services to register for the shard, as well as the form to upload fan ages.
    </p>
    <p>
      Furthermore, I have also gone through some things on the Destiny shard. I have properly set a whole lot of global
      SDLs so that full playthroughs are now actually possible. You should be able to play all the content, including
      gathering all Relto pages and sparkies.
    </p>
    <p>
      Let me know if you encounter any issues. I am always available on Discord (Tag "mystler") and I also hang out on
      the OpenURU and Cyan Discord servers.
    </p>
    <p>I hope you enjoy the new website and playing on Destiny. ❤️</p>
  </Card>
</div>
