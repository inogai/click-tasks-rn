# Click Tasks React Native

## Development

This project uses pnpm to manage its dependencies

```sh
pnpm i
```

Run the development server:

```sh
pnpm android
# or
pnpm ios
```

### Yarn

We are installing [`@react-native-voice/voice`](https://github.com/react-native-voice/voice) from source. You will need `yarn` to build it.

In case it didn't work, please clear pnpm cache and reinstall it manually.
```sh
pnpm rm @react-native-voice/voice
pnpm store prune
pnpm i bonesyblue/react-native-voice#55a58924534e168d26c9da17db43eecc983630fc
```
