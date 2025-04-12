# i18n Guide

We utilze the package `i18next` and `react-i18next` to tranlate our app.
It use a key-value based approach.

## Key Naming Convention

We follow a hierarchical naming convention for translation keys to ensure consistency, discoverability, and maintainability across the application.

### General Structure

Translation keys follow this pattern:

```
<toplevel>.<feature>[<.element>][<.variant>]
```

- **toplevel**: A page (`home`) or component (`calendar`).
- **feature**: A subcomponent (`calendar.strip`) or a section (`preference.theme`)
- **element**: (Optional) A specific UI element or message. Use simple yet meaningful names like `.label`, `.title`, `.values.<some_value>`
- **variant**: (Optional) A variant of the message. e.g. `calendar.weekday.narrow`

## Procedures

- translations are primarily stored at `~/locales-src/*.yaml`
- use `pnpm locales` or `pnpm dev:locales` to convert into `~/locales/*.json`
- import the jsons and send to `~/lib/i18n.ts`
- `import { t } from '~/lib/i18nts'`
- use `t(<key>)` everywhere you would pass in UI strings, i.e. labels, titles, `<Text>` elements.

## Developer Tools

- VSCode Extension [kirigaya.i18n-haru](https://marketplace.visualstudio.com/items?itemName=kirigaya.i18n-haru)
- Neovim Extension [js-i18n.nvim](https://github.com/nabekou29/js-i18n.nvim)
