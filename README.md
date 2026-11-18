# EcmaBankWebsite

A responsive educational banking landing page built with HTML, CSS and vanilla JavaScript. The operations panels and customer stories are illustrative. This project has no banking backend, account creation, payments or loan processing.

## Run locally

No dependency installation or build step is needed. From the repository directory:

```powershell
python -m http.server 8089 --bind 127.0.0.1
```

Open <http://127.0.0.1:8089>. Stop the server with Ctrl+C.

## Interaction behavior

- Navigation uses native fragment links with an offset for the persistent header. The mobile menu closes on section selection, outside clicks, Escape and breakpoint changes.
- Operations tabs support clicks, Left/Right, Home and End, with selected states and linked tab panels.
- Carousel dots, previous/next controls and keyboard navigation share one active slide state. Arrow keys act only while focus is in the carousel; they do not interfere with form inputs. Inactive slides are hidden from assistive technology.
- The native account dialog supports Escape, backdrop clicks, visible close controls, focus containment and focus restoration. Closing clears the demo fields.
- Required names reject whitespace-only input. Email validation uses the browser's email input. The form displays validation feedback without sending, storing or putting details in the URL. It never opens an account.
- Images use native lazy loading; sections remain visible when JavaScript or IntersectionObserver is unavailable. Reduced-motion preferences disable animation.
- Existing placeholder footer links point to available sections or the demo form. Brand text, heading structure and attribution have been corrected.

## Asset cache versions

`index.html` includes content hashes in the CSS and JavaScript query strings. After changing either asset, update its `?v=` value to the first ten characters of that file's SHA-256 digest. This prevents an older cached asset from being mixed with newer HTML.

## Verification

Manual browser checks cover 320px, 390px, 768px and 1440px layouts, mobile navigation, tabs, carousel dot/arrow ordering, modal keyboard behavior and invalid/valid demo form submissions. Checks also cover internal anchor targets, local asset responses and JavaScript syntax:

```powershell
node --check script.js
```

The original design is credited to Jonas Schmedtmann; EcmaBank adaptation by Milad Sadeghi DM. The repository's MIT license is preserved in `LICENSE`.
