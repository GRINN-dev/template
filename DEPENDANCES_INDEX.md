# Liste des librairies utilisées

## workers

```json
{
  "name": "workers",
  "dependencies": {
    "@getbrevo/brevo": "2.2.0",
    "graphile-worker": "^0.16.6",
    "handlebars": "^4.7.8",
    "puppeteer": "^23.8.0",
    "algoliasearch": "^4.22.1"
  }
}
```

Brevo sur tous les projets
voir CdF pour un début de puppeteer.

## BDD

```json
{
  "name": "db",
  "description": "Manage database migrations with graphile-worker",
  "dependencies": {
    "graphile-migrate": "2.0.0-rc.2",
    "graphile-worker": "^0.16.6"
  },
  "devDependencies": {
    "@grinn/eslint-config": "workspace:^0.2.0",
    "@grinn/prettier-config": "workspace:^0.1.0"
  }
}
```

## API

```json
{
  "name": "api",
  "dependencies": {
    "@aws-sdk/client-s3": "^3.696.0",
    "@aws-sdk/s3-presigned-post": "^3.696.0",
    "@aws-sdk/s3-request-presigner": "^3.696.0",
    "@dataplan/json": "0.0.1-beta.25",
    "@dataplan/pg": "0.0.1-beta.27",
    "@getbrevo/brevo": "2.2.0",
    "@graphile/simplify-inflection": "8.0.0-beta.5",
    "@types/multer": "^1.4.12",
    "chalk": "^5.3.0",
    "cookie": "^1.0.1",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "express": "^4.21.1",
    "express-slow-down": "^2.0.3",
    "graphile-build": "5.0.0-beta.28",
    "graphile-build-pg": "5.0.0-beta.32",
    "graphile-worker": "^0.16.6",
    "jsonwebtoken": "^9.0.2",
    "lodash": "^4.17.21",
    "morgan": "^1.10.0",
    "multer": "1.4.5-lts.1",
    "pg": "^8.13.1",
    "postgraphile": "5.0.0-beta.33",
    "postgraphile-plugin-connection-filter": "3.0.0-beta.5",
    "sharp": "^0.33.5"
  },
  "devDependencies": {
    "@grinn/eslint-config": "workspace:^0.2.0",
    "@grinn/prettier-config": "workspace:^0.1.0",
    "@grinn/tsconfig": "workspace:^0.1.0",
    "@types/cookie": "^1.0.0",
    "@types/cookie-parser": "^1.4.7",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/lodash": "^4.17.13",
    "@types/morgan": "^1.9.9",
    "@types/pg": "^8.11.10",
    "eslint": "^9.15.0",
    "prettier": "^3.3.3",
    "tsup": "8.3.0",
    "typescript": "^5.6.3"
  }
}
```

ASW sdk S3, stockage de média (photo).

## mobile

```json
{
  "name": "mobile",
  "dependencies": {
    "@apollo/client": "^3.11.10",
    "@expo/vector-icons": "^14.0.4",
    "@grinn/graphql": "workspace:^0.1.0",
    "@react-navigation/native": "^6.0.2",
    "expo": "~52.0.8",
    "expo-constants": "~17.0.3",
    "expo-font": "~13.0.1",
    "expo-linking": "~7.0.3",
    "expo-router": "~4.0.7",
    "expo-secure-store": "^14.0.0",
    "expo-splash-screen": "~0.29.11",
    "expo-status-bar": "~2.0.0",
    "expo-system-ui": "~4.0.3",
    "expo-web-browser": "~14.0.1",
    "expo-calendar": "^14.0.6",
    "nativewind": "~4.0.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-native": "0.76.2",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "4.1.0",
    "react-native-svg": "15.8.0",
    "react-native-maps": "^1.20.1",
    "react-native-svg-transformer": "^1.4.0",
    "react-native-web": "~0.19.10",
    "react-calendly": "^4.3.0",
    "i18next": "^23.7.6",
    "algoliasearch": "^4.22.1",
    "@algolia/recommend": "^4.22.1",
    "@algolia/recommend-react": "^1.12.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@grinn/eslint-config": "workspace:^0.2.0",
    "@grinn/prettier-config": "workspace:^0.1.0",
    "@grinn/tailwind-config": "workspace:^0.1.0",
    "@grinn/tsconfig": "workspace:^0.1.0",
    "@types/jest": "^29.5.12",
    "@types/react": "~18.2.45",
    "@types/react-test-renderer": "^18.0.7",
    "eslint": "^8.57.0",
    "jest": "^29.2.1",
    "jest-expo": "~51.0.3",
    "prettier": "^3.2.5",
    "react-test-renderer": "18.2.0",
    "tailwindcss": "^3.4.1",
    "typescript": "~5.3.3"
  }
}
```

Expo : Framework for native application, for development and delivery.
Expo calendar : gestion du calendrier device (Feder)
Expo contacts: utilisation des contacts téléphone (Feder)
Calendly : API de gestion de calendriers et rendez-vous sur Calendly. (Peppsy)
i18n : internationalisation. (Peppsy)
Apollo : librairy to implement security on API calls
Algolia : moteur de recherche
React Native maps (Feder)

## site

```json
{
  "name": "@grinn/site",
  "dependencies": {
    "@apollo/client": "^3.11.10",
    "@apollo/experimental-nextjs-app-support": "^0.11.6",
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@grinn/graphql": "workspace:^0.1.0",
    "@hookform/resolvers": "^3.9.1",
    "@lexical/react": "^0.21.0",
    "@lexical/rich-text": "^0.21.0",
    "@lexical/selection": "^0.21.0",
    "@lexical/utils": "^0.21.0",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@t3-oss/env-nextjs": "^0.11.1",
    "apollo-link-token-refresh": "^0.7.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.5.2",
    "framer-motion": "^11.11.17",
    "geist": "^1.3.1",
    "gql.tada": "^1.8.10",
    "jose": "^5.9.6",
    "lexical": "^0.21.0",
    "lucide-react": "^0.460.0",
    "next": "^15.0.3",
    "next-themes": "^0.4.3",
    "react": "18.2.0",
    "react-circular-progressbar": "^2.1.0",
    "react-dom": "18.2.0",
    "react-dropzone": "^14.3.5",
    "react-hook-form": "^7.53.2",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8",
    "algoliasearch": "^4.22.1",
    "@algolia/recommend": "^4.22.1",
    "@algolia/recommend-react": "^1.12.0"
  },
  "devDependencies": {
    "@grinn/eslint-config": "workspace:^0.2.0",
    "@grinn/prettier-config": "workspace:^0.1.0",
    "@grinn/tailwind-config": "workspace:^0.1.0",
    "@grinn/tsconfig": "workspace:^0.1.0",
    "@tailwindcss/typography": "^0.5.16",
    "@types/node": "^22.9.1",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "dotenv-cli": "^7.4.3",
    "eslint": "^9.15.0",
    "jiti": "^2.4.0",
    "prettier": "^3.3.3",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3"
  }
}
```

Apollo : librairy to implement security on API calls
Radi UI : design
zod : formaulaires.
