# EcmaBankWebsite

A responsive educational banking landing page built with HTML, CSS and vanilla JavaScript. The operations panels and customer stories are illustrative. The account information request form uses Netlify Forms; this project does not create bank accounts, process loans or move money.

## Run locally

No dependency installation or build step is needed. From the repository directory:

```powershell
python -m http.server 8089 --bind 127.0.0.1
```

Open <http://127.0.0.1:8089>. Stop the server with Ctrl+C.

## Netlify deployment and account requests

1. Merge this branch into the production branch (`main` or `master`) and connect it to Netlify.
2. Keep the build command empty. `netlify.toml` publishes the repository root (`.`).
3. In Netlify **Forms**, enable **form detection**, then deploy or redeploy.
4. Confirm **account-request** appears in Forms, submit once from the deployed site, and check **Verified submissions** (or **Spam**).
5. Configure **Forms > Submission notifications** for email alerts; no notification address is hard-coded.

The static form includes matching `form-name` and `bot-field` honeypot inputs. Requests use URL-encoded POSTs with pending, success and retryable error feedback. Localhost, loopback and file previews never send or save data. A received request does not open a bank account. Live delivery must be verified after deployment.

See [Netlify Forms setup](https://docs.netlify.com/manage/forms/setup/) and [spam filtering](https://docs.netlify.com/manage/forms/spam-filters/).

```powershell
node --test tests/netlify-form.test.cjs
```

## Interaction behavior

- Navigation uses native fragment links with an offset for the persistent header. The mobile menu closes on section selection, outside clicks, Escape and breakpoint changes.
- Operations tabs support clicks, Left/Right, Home and End, with selected states and linked tab panels.
- Carousel dots, previous/next controls and keyboard navigation share one active slide state. Arrow keys act only while focus is in the carousel; they do not interfere with form inputs. Inactive slides are hidden from assistive technology.
- The native account dialog supports Escape, backdrop clicks, visible close controls, focus containment and focus restoration. Closing clears idle fields; an in-flight request retains its state until it finishes.
- Required names reject whitespace-only input. Email validation uses the browser's email input. On Netlify the form sends a request for account information; locally it shows preview feedback without sending. Details are never put in the URL, and a request never opens an account.
- Images use native lazy loading; sections remain visible when JavaScript or IntersectionObserver is unavailable. Reduced-motion preferences disable animation.
- Existing placeholder footer links point to available sections or the account information form. Brand text, heading structure and attribution have been corrected.

## Asset cache versions

`index.html` includes content hashes in the CSS, JavaScript and `netlify-form.js` query strings. After changing either asset, update its `?v=` value to the first ten characters of that file's SHA-256 digest. This prevents an older cached asset from being mixed with newer HTML.

## Verification

Manual browser checks cover 320px, 390px, 768px and 1440px layouts, mobile navigation, tabs, carousel dot/arrow ordering, modal keyboard behavior and invalid/valid demo form submissions. Checks also cover internal anchor targets, local asset responses and JavaScript syntax:

```powershell
node --check script.js
```

The original design is credited to Jonas Schmedtmann; EcmaBank adaptation by Milad Sadeghi DM. The repository's MIT license is preserved in `LICENSE`.
