# joyinscrum-app

Mobile client for __joyinscrum__ application.

To override registry in __package-lock.json__, try using:

```bash
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm --registry https://registry.npmjs.org install
```

install react native paper

```bash
npm install react-native-paper
```

install react native navigation

```bash
npm install @react-navigation/native
npx expo install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
```

install material theming

```bash
npx expo install @pchmn/expo-material3-theme
npx expo install expo-system-ui
npx expo prebuild --platform android
npx expo run:android
```

install supabase

```bash
npm i @supabase/supabase-js
```

building in eas
```bash
npx expo install expo-system-ui
# commit all pending git changes
npx expo prebuild --clean
eas build
```

