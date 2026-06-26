# amalia.js-player

> Metadata-enriched HTML5 video player — synchronize timelines, captions, overlays, storyboards and custom data with video.

This is a **maintained fork** of [INA's amalia.js](https://github.com/ina-foss/amalia.js). The original project by the Institut National de l'Audiovisuel (INA) is no longer actively updated; this fork modernizes the build and dependencies so the library installs and runs on current Node.js and browsers, while preserving the original API. All credit for the original work goes to INA. Distributed under the [MIT License](./LICENSE).

## Installation

```sh
npm install amalia.js-player
```

The compiled library ships in the `build/` directory of the package:

- `build/js/amalia.js-player.min.js` — core player
- `build/js/amalia.js-player-plugin-*.min.js` — optional plugins (timeline, captions, overlay, text-sync, storyboard, editor, watermark, YouTube, d3)
- `build/css/amalia.js-player.min.css` — player styles
- `build/fonts/` — icon webfont

### Runtime dependencies

amalia.js-player is a jQuery plugin and expects [jQuery](https://jquery.com/) (3.7.x), [jQuery UI](https://jqueryui.com/) (1.13.x) and [Raphaël](https://dmitrybaranovskiy.github.io/raphael/) (2.3.x) to be loaded first.

## Usage

Load the dependencies and the player, then attach it to a container element:

```html
<!-- runtime dependencies -->
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/jquery-ui-dist/jquery-ui.min.js"></script>
<script src="node_modules/raphael/raphael.min.js"></script>

<!-- player core + styles -->
<link  href="node_modules/amalia.js-player/build/css/amalia.js-player.min.css" rel="stylesheet">
<script src="node_modules/amalia.js-player/build/js/amalia.js-player.min.js"></script>

<!-- optional: a plugin -->
<script src="node_modules/amalia.js-player/build/js/amalia.js-player-plugin-timeline.min.js"></script>

<div id="player" style="height: 350px;"></div>

<script>
  $(function () {
    $("#player").mediaPlayer({
      autoplay: false,
      src: "media/example.mp4",
      controlBar: { sticky: true },
      plugins: {
        dataServices: ["data/example-timeline.json"],
        list: [
          {
            className: "fr.ina.amalia.player.plugins.TimelinePlugin",
            container: "#player",
            parameters: { metadataId: "example", title: "My timeline" }
          }
        ]
      }
    });
  });
</script>
```

### Interactive playground

**Live demo:** https://alex-andreiev.github.io/amalia.js/ (GitHub Pages, served from [`docs/`](./docs)).

Open [`playground.html`](./playground.html) in a browser (after `npm run build`) for a live configurator: it embeds the player with a free public sample video and exposes the player parameters as form controls that apply changes in real time, with the generated `mediaPlayer()` config shown alongside. It also demonstrates the extra control-bar widgets this fork adds (below): editable subtitles, a download button, and a playlist with previous/next and a selectable menu.

The hosted demo lives in [`docs/`](./docs) (page + a copy of the build). Regenerate it after changes with `npm run pages`.

More complete, runnable examples (timeline, captions, overlay, text-sync, editor, watermark, webfont) are in the [`samples/`](./samples) directory.

### Control-bar widgets

This fork adds reusable control-bar widgets. They're registered automatically when the library loads; enable them by listing them in `controlBar.widgets`. Setting `widgets` replaces the defaults, so include the standard ones (`TimeLabel`, `PlayButton`, `PauseButton`, `VolumeControlBar`, `FullscreenButton`) alongside the extras.

| Widget | Class | What it does |
|---|---|---|
| Subtitles toggle | `CaptionsButton` | "CC" button that shows/hides the captions overlay. Param `defaultState: false` starts hidden. |
| Download | `DownloadButton` | Downloads the current source. Fetches it as a blob (saves the file) for same-origin / CORS-enabled URLs; falls back to opening the URL otherwise. |
| Playlist prev/next | `PlaylistButton` | Skip buttons. Param `direction: 'prev' \| 'next'`. On click fires `ajs:playlist:prev` / `ajs:playlist:next` on the player container. |
| Playlist menu | `PlaylistMenuButton` | List icon opening a popup of all videos. Param `items: [labels]`. Selecting one fires `ajs:playlist:select` (with its index); listens for `ajs:playlist:changed` to highlight the current entry. |

The playlist widgets are UI-only — the host page owns the list and switches the source. The pattern (used in `playground.html`): keep an array of URLs + a current index, handle the `ajs:playlist:*` events by calling `player.setSrc(url, true)`, auto-advance on the player's `ENDED` event, and re-broadcast `ajs:playlist:changed` so the menu stays in sync. Full class names are under `fr.ina.amalia.player.plugins.controlBar.widgets.*`.

## Build from source

```sh
$ npm install
$ npm run build   # or: npx grunt
```

The compiled library is written to the `build/` directory. The default Grunt task runs JSHint, then bundles and minifies the JavaScript (UglifyJS) and compiles the SCSS (Dart Sass).

## What changed in this fork

This fork brings the original 2015–2023 codebase up to date so it builds and installs on modern toolchains:

- **Node.js 18+ / npm 10** — the build tooling was upgraded from the Node 0.11 era (Grunt `0.4` → `1.6`, UglifyJS, JSHint, copy/clean/watch plugins all to current majors).
- **Dart Sass** replaces the unmaintained, native `node-sass`/libsass (which no longer builds on modern Node). A few latent SCSS bugs that old libsass silently tolerated were fixed.
- **Runtime libraries upgraded** to the latest versions compatible with the player: jQuery `3.7.x`, jQuery UI `1.13.x`, Raphaël `2.3.x`.
- **Unused/abandoned build dependencies removed** to cut install size and known vulnerabilities.
- **New control-bar widgets** — subtitles (CC) toggle, download, and playlist (prev/next + selectable menu). See [Control-bar widgets](#control-bar-widgets).
- **MIT licensed**, consistent with the upstream relicensing.

See [`releases.md`](./releases.md) for the version history.

## License

[MIT](./LICENSE) © Institut National de l'Audiovisuel (INA) and contributors.
