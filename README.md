# SiFilex 📁

SiFilex est une application de gestion de fichiers sécurisée construite avec Next.js 14 et Ant Design 4. Elle permet aux utilisateurs de télécharger, gérer et partager des fichiers de manière sécurisée.

## Fonctionnalités ✨

- 🔐 Authentification via Google et GitHub
- 📤 Upload de fichiers avec barre de progression
- 🔄 Gestion des fichiers (renommer, supprimer, prévisualiser, télécharger)
- 🔗 Partage sécurisé via liens
- 🎨 Interface utilisateur moderne et responsive
- 🌙 Thème sombre personnalisé

## Technologies Utilisées 🛠️

- [Next.js 14](https://nextjs.org/) - Framework React
- [Ant Design 4](https://ant.design/) - Bibliothèque de composants UI
- [EdgeStore](https://edgestore.dev/) - Stockage de fichiers
- [NextAuth.js](https://next-auth.js.org/) - Authentification
- [TypeScript](https://www.typescriptlang.org/) - Typage statique

## Prérequis 📋

- Node.js (version 18 ou supérieure)
- npm ou pnpm

## Installation 🚀

1. Clonez le dépôt :
```bash
git clone https://github.com/fabgrd/sifilex.git
cd sifilex
```

2. Installez les dépendances :
```bash
pnpm install
```

3. Configurez les variables d'environnement :
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
```env
# Authentication
GITHUB_ID=votre_github_id
GITHUB_SECRET=votre_github_secret
GOOGLE_ID=votre_google_id
GOOGLE_SECRET=votre_google_secret
NEXTAUTH_SECRET=votre_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# EdgeStore
EDGE_STORE_ACCESS_KEY=votre_edge_store_access_key
EDGE_STORE_SECRET_KEY=votre_edge_store_secret_key
```

4. Lancez le serveur de développement :
```bash
pnpm dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Structure du Projet 📂

```
sifilex/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── atoms/       # Composants de base
│   │   │   ├── molecules/   # Composants composés
│   │   │   ├── organisms/   # Composants complexes
│   │   │   └── templates/   # Templates de pages
│   │   ├── lib/
│   │   │   ├── context/     # Contextes React
│   │   │   ├── hooks/       # Hooks personnalisés
│   │   │   ├── providers/   # Providers
│   │   │   ├── strategies/  # Stratégies de prévisualisation
│   │   │   └── utils/       # Utilitaires
│   │   └── styles/          # Styles CSS
│   └── lib/                 # Configuration EdgeStore
└── public/
    └── fonts/              # Polices personnalisées
```

## Fonctionnalités Détaillées 🔍

### Gestion des Fichiers
- Upload multiple de fichiers
- Barre de progression en temps réel
- Validation des types de fichiers
- Limite de taille configurable

### Sécurité
- Authentification sécurisée
- Stockage chiffré des fichiers
- Liens de partage sécurisés
- Contrôle d'accès aux fichiers

### Interface Utilisateur
- Design moderne et intuitif
- Thème sombre personnalisé
- Composants réutilisables
- Retours visuels des actions

## Contribution 🤝

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request


## Auteur 👥

- **Fabien Giraudier** - *Développeur initial* - [GitHub](https://github.com/fabgrd)