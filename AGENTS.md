<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Public homepage work previews read the same published case-study catalogue as the Work page, but fail open to the existing static homepage when that catalogue is unavailable; this keeps the first screen usable during content-service outages.

Keep speculative brand-family identity systems on a separate comparison route until a direction is approved; this prevents an exploration from silently replacing the live NDH identity.

The root route is the parent-brand gateway and must remain independent from any one subsidiary's workflow; each business is linked as a sibling destination.

The approved Open Gateway asset is the parent homepage identity, and subsidiaries use that same asset with an integrated corner icon; this keeps the family recognisable as it grows.

Use the Precision Gateway shared shell and tokens for public pages and signed-in portals; one visual system prevents subsidiaries and workflows from looking like unrelated products.
- Each NDH business has its own reading page at /businesses/$id driven by business-profiles.ts + business-details.ts; the homepage stays short and links out instead of holding every section.

- Daily photo flyers share one canvas layout between browser preview and pure-JS server rendering; this avoids native rendering dependencies and paid AI calls for routine exports.
- Daily flyer settings and archives are admin-only with private storage; signed links expire after seven days so private studio access is never exposed in the public navigation.
- Automatic daily generation is idempotent by Lagos calendar date and runs through an authenticated managed callback; this prevents duplicate daily posts and works without an open browser.
