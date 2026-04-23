# Our.one / Hall

The governance platform for [Our.one](https://our.one).

Hall is where Our.one members vote on what gets built next, watch the treasury in real time, see every shipping decision, and hold the parent company accountable.

The Constitution promises a transparent ledger. Hall is its first product-shaped form.

## Status

Hall is in build. This repository is the starting point. The first working version (MVP scope below) is targeted for the next few weeks.

## MVP scope

1. **Authenticated access** for Patrons and Members (Auth.js, magic link)
2. **Treasury dashboard** — live revenue, direct costs, distribution by role
3. **Proposals + voting** — structured proposal object with weighted votes (Patron 2× governance weight)
4. **Shipping log** — append-only log of shipped changes, linkable to the vote that triggered each
5. **Member directory** — opt-in visibility, roles held per member
6. **Constitution browser** — current text + amendments in active voting
7. **Discussion threads** — lightweight conversation under each proposal

## Definition of done (Hall MVP)

Hall is shipped when:

1. A Patron who paid $100 can log in and see their account
2. A Member who paid $30/year can log in and see their account
3. At least one active proposal is visible with a live vote UI and weighted results
4. At least one entry appears in the shipping log
5. The treasury dashboard shows real numbers
6. The member directory lists opt-in public members
7. The Constitution is browsable with version history
8. The first-flagship-category vote is live and countdown visible from `/`

## License

AGPL-3.0 — see [LICENSE](./LICENSE).

This is a constitutional choice: anyone can read, audit, and learn from Hall's code. Commercial forks must remain open under the same terms. The "AI-built, community-owned" promise is verifiable in source.

## Related

- Marketing site: [our.one](https://our.one) ([github.com/Our-One/our-one](https://github.com/Our-One/our-one), private)
- Constitution: [our.one/constitution](https://our.one/constitution)
- Build Log: [our.one/build-log](https://our.one/build-log)
- Founders page: [our.one/founders](https://our.one/founders)
