# omrilotan

Source for my [GitHub profile](https://github.com/omrilotan) README.

[![Build profile README](https://github.com/omrilotan/omrilotan/actions/workflows/build.yml/badge.svg)](https://github.com/omrilotan/omrilotan/actions/workflows/build.yml)

- This `build` branch holds the generator.
- A scheduled [GitHub Actions workflow](.github/workflows/build.yml) runs it (and reruns on every push to `build`), then publishes the rendered `README.md` and article cards to the `main` branch, which GitHub shows on the profile.

```sh
npm test   # print the generated markdown to stdout
npm run build   # write dist/README.md and dist/cards/*.svg
```

No dependencies — Node (see [`.nvmrc`](.nvmrc)) with native `fetch`.
