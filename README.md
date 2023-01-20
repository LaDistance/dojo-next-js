# Dojo Next.js

# Version française
## Introduction

Bonjour et bienvenue dans ce dojo intitulé "Créer des applications Full Stack avec Next.js" !

Dans ce dojo, nous vous montrerons une stack qui est, selon nous, l'une des meilleures stack en ce moment en matière de Developer eXperience. 
L'application que nous créerons ensemble a un but assez simple : pouvoir se créer des listes de vos films favoris. Cependant pour que cela soit un peu plus amusant, 
nous irons de bout en bout : de la conception au déploiement, et ceci en seulement quelques heures ! Merci Next.js ;)

## Prérequis

[pnpm](https://pnpm.io/fr/installation) 

## Etape 1 : concept(ion)

Je suis un utilisateur lambda un peu tête en l'air, et j'aime beaucoup regarder des films, mais je ne sais jamais lequel regarder parce que j'ai tendance à oublier ceux que j'ai apprécié ! Si seulement j'avais une application pour me créer des listes des films que j'ai adoré et les noter... Mais en fait, ce n'est pas si dur que ça !

Pour éviter de devoir rentrer nous mêmes tous les films, utilisons la (très utilisée dans les tutoriels) fameuse [API de la Movie Database](https://developers.themoviedb.org/3/getting-started).
Celle-ci nous permettra d'afficher une superbe interface dans laquelle choisir les films plutôt que de devoir tout réécrire nous-mêmes.

On pourrait très bien imaginer une page de connexion, une page d'accueil dans laquelle une liste aléatoire (ou non) de films sont affichés avec une possibilité de les ajouter dans une liste et de les noter, et une page pour choisir une de vos listes et afficher les films correspondants.

Tout d'abord il nous faut une base de données pour stocker nos listes de films et leurs notes. En réalité, pour une utilisation aussi simple, vous pourriez choisir presque n'importe quel moteur de base de données, mais par préférence nous utiliserons PostgreSQL dans ce dojo. Pour vous éviter de setup une base de données vous-mêmes, nous profiterons de l'offre gratuite de [Neon](https://neon.tech), qui fait du PostgreSQL managé avec une offre gratuite assez généreuse.

Voici le schéma qui me vient à l'esprit quand je pense à la base de données de cette application (bien évidemment, cela peut être fait de multiples manières différentes): 

![french_schema](../fr/images/dojo_db_schema_fr.png)

Pour faire communiquer notre interface et notre base de données, nous utiliserons [Prisma](https://www.prisma.io/). Prisma est un ORM pour TypeScript qui gère les migrations, le modèle de votre base de données, mais aussi la sécurité des types (type-safety) et l'autocomplétion, que nous aimons beaucoup chez les devs TypeScript.

Nous utiliserons aussi [tRPC](https://trpc.io/). C'est probablement la technologie la moins "connue" de la stack et pourtant c'est une petite merveille ! tRPC nous aidera à faire une API qui relie notre interface directement à nos données de manière type-safe, en utilisant la puissance de l'inférence de TypeScript et notre IDE préféré VSCode pour pouvoir aller très vite dans le développement de nos fonctionnalités sans rien casser.

Enfin, pour nous authentifier, nous utiliserons [NextAuth.js](https://next-auth.js.org/) avec un provider externe. Dans ce dojo nous utiliserons GitHub en tant que provider, mais NextAuth supporte de nombreux providers, et permet même d'en ajouter un nous-même.

Une fois que vous avez digéré toutes ces informations, il est l'heure de préparer le terrain.

## Etape 2 : préparation des différents services, providers, et installation du boilerplate.

### Neon : un PG managé en deux minutes chrono.

Comme dit précédemment, nous avons besoin d'une base de données. Cependant, ceci étant un dojo, je ne vais pas commencer à vous expliquer comment setup une base avec Docker, ou vous demander de setup une base managée payante. Notre moteur préféré (PostgreSQL, bien évidemment) est disponible en version managée, avec une offre gratuite largement suffisante pour nos besoins actuels, chez [Neon.tech](https://neon.tech) ! 

Utilisez votre navigateur favori (Firefox master race. Pas de discussion.) pour naviguer sur la page d'accueil de Neon : 

![neon_home](en/images/neon_homepage.png)

Cliquez sur le gros bouton "Sign up" en plein milieu de la page.

![neon_signup](en/images/neon_signup.png)

Utilisez le provider que vous voulez. Vous arriverez sur cette page :

![neon_no_project_yet](en/images/neon_no_project_yet.png)

Créez un projet et donnez-lui le nom que vous voulez.
On n'oublie pas la localisation de la DB qui nous donne de meilleures performances et qui limite (un peu...) la perte de souveraineté de nos données au profit de nos collègues américains. 

![neon_project_creation](en/images/neon_project_creation.png)

Une fois ceci fait, vous pouvez accéder à votre base de données grâce à la chaine de connexion fournie par Neon. Patientez un petit peu, nous voulons d'abord configurer une branche de développement.
Naviguez vers la section "Branches" de l'interface et créez une branche "dev". 

![neon_branches_1](en/images/neon_branches_1.png)

![neon_branch_creation](en/images/neon_branch_creation.png)

Retournez au niveau de la section "Branches" de l'interface et constatez la création de la branche "dev".

![neon_branches_2](en/images/neon_branches_2.png)

Votre base de données est prête à être utilisée. Nous configurerons le lien à celle-ci un peu plus tard.

### De l'authentification très rapidement à l'aide du provider GitHub.

NextAuth nous permet de mettre en place de l'authentification sur notre application très facilement avec OAuth. Pour pouvoir faire cela cependant, il nous faut un provider. Vous avez très certainement un compte GitHub, nous utiliserons donc ce provider, cependant il est possible d'utiliser Google, Discord, et même Slack ! ;)
Vous pouvez aussi utiliser un provider maison.

Il nous faudra répertorier deux applications chez GitHub : une application locale pour le développement, et une application pour la production.

Répertorions ensemble l'application pour le développement à [cette adresse](https://github.com/settings/apps/new).

![github_dev_app_creation](en/images/github_dev_app_creation.png)

Ceci nous permettra de nous authentifier même en local.

GitHub vous redirige vers une page sur laquelle vous trouverez le "client ID" de votre application, et pourrez générer un nouveau "client secret".

Nous ferons la même opération pour votre application en production un peu plus tard.

### Installation du boilerplate de notre application à l'aide de create-t3-app

Pour cette application, nous utiliserons la [T3 stack](https://create.t3.gg/) (sans Tailwind, je ne suis pas un grand fan de Tailwind. Peut-être un jour ?). Nous avons déjà explicité les différents modules présents dans la T3 stack plus haut : Next.js, Prisma, NextAuth, tRPC, TypeScript (T3 vient de TypeScript, tRPC, Tailwind).

Pour lancer une application T3, utilisons pnpm dans le dossier de votre choix : 

```pnpm create t3-app```

Le CLI vous guide, configurez votre boilerplate comme ceci : 

![pnpm_create_t3_app](en/images/pnpm_create_t3_app.png)

### Configuration des outils

Plus qu'un peu de configuration et nous pourrons commencer à développer notre application.

