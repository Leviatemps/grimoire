# 🔮 Grimoire — Guide de démarrage

## Prérequis

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Xcode) ou Android Emulator (Android Studio)
- Ou l'app **Expo Go** sur votre téléphone

## Installation

```bash
cd Grimoire
npm install
```

## Lancer l'app

```bash
npx expo start
```

Puis :
- Appuyez sur `i` pour iOS Simulator
- Appuyez sur `a` pour Android Emulator
- Scannez le QR code avec Expo Go (iOS/Android)

## Structure du projet

```
Grimoire/
├── app/                        # Expo Router (file-based routing)
│   ├── _layout.tsx             # Root layout — init DB, providers
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar avec bouton + central
│   │   ├── index.tsx           # 🏠 Accueil — flux chronologique
│   │   ├── categories.tsx      # 📁 Catégories
│   │   ├── search.tsx          # 🔍 Recherche full-text
│   │   └── profile.tsx         # 👤 Profil & stats
│   ├── add/
│   │   ├── index.tsx           # Choix du type de contenu
│   │   ├── link.tsx            # Formulaire ajout lien + OG preview
│   │   ├── photo.tsx           # Formulaire ajout photo
│   │   └── note.tsx            # Formulaire ajout note
│   ├── category/
│   │   ├── create.tsx          # Créer catégorie / sous-catégorie
│   │   └── [id].tsx            # Détail d'une catégorie
│   └── item/
│       └── [id].tsx            # Détail d'un contenu
│
├── src/
│   ├── db/database.ts          # SQLite — schema + CRUD helpers
│   ├── stores/
│   │   ├── itemsStore.ts       # Zustand — items
│   │   └── categoriesStore.ts  # Zustand — categories & subcategories
│   ├── components/
│   │   ├── ItemCard.tsx        # Card visuelle d'un contenu
│   │   ├── CategoryChip.tsx    # Chip colorée de catégorie
│   │   ├── CategoryPicker.tsx  # Sélecteur catégorie / sous-cat
│   │   ├── FilterBar.tsx       # Filtres par type (lien/photo/note)
│   │   └── EmptyState.tsx      # État vide générique
│   ├── types/index.ts          # Types TypeScript partagés
│   └── utils/helpers.ts        # generateId, fetchOGData, formatDate…
│
├── app.json                    # Config Expo
├── package.json
├── tailwind.config.js
├── babel.config.js
└── metro.config.js
```

## Fonctionnalités

| Fonctionnalité | Statut |
|---|---|
| Ajouter un lien avec prévisualisation OG | ✅ |
| Ajouter une photo (galerie ou appareil photo) | ✅ |
| Ajouter une note textuelle | ✅ |
| Créer des catégories (couleur + icône) | ✅ |
| Créer des sous-catégories | ✅ |
| Filtres par type de contenu | ✅ |
| Filtres par catégorie | ✅ |
| Recherche full-text | ✅ |
| Stockage local SQLite (offline-first) | ✅ |
| Export JSON | ✅ |
| Vue détail d'un contenu | ✅ |
| Mode sombre | 🔜 |
| Sync cloud (Supabase) | 🔜 |
| Viewer photo plein écran | 🔜 |

## Dépendances principales

- **expo-router** — navigation file-based
- **expo-sqlite** — stockage local offline-first
- **zustand** — state management léger
- **nativewind** — Tailwind CSS pour React Native
- **expo-image-picker** — galerie & appareil photo
- **expo-web-browser** — navigateur intégré pour les liens
- **Microlink API** — scraping des métadonnées Open Graph
