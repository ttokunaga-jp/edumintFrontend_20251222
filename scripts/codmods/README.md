Tailwind -> MUI codemod plan

This folder contains planning notes and skeleton codemods for migrating simple Tailwind utility usages
into MUI `sx` / theme-based styles or CSS modules.

Approach:
1. Run `node ../tailwind-inventory.js` to create a JSON inventory of className usages.
2. Use `mapping.json` to detect class sets that can be safely auto-mapped.
3. For safe matches, generate suggested `sx` replacements and write a patch (or PR with suggested edits).
4. High-risk files should be flagged for manual migration.

Run the planner (dry run):
  node ./tailwind-to-sx-planner.js --inventory ../reports/tailwind-inventory.json
