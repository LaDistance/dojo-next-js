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

![french_schema](fr/images/dojo_db_schema_fr.png)

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

Pour utiliser Prisma avec Neon, il est aussi nécessaire de créer une "shadow database" côté Neon.
Cette seconde base de données permet à Prisma de détecter les différences de schéma lors des migrations.

Rendez-vous donc dans l'onglet "Tables" de l'interface et dans "Database", sélectionnez "Create new database".
Donnez-lui un nom et cliquez sur créer. Récupérez l'URL de connexion.

Pour plus d'informations vous pouvez aussi suivre ce guide (anglais) :
https://neon.tech/docs/guides/prisma

Votre base de données est prête à être utilisée. Nous configurerons le lien à celle-ci un peu plus tard.

### Création de compte TMDB

Pour utiliser l'API de TMDB, il faut se créer un compte utilisateur sur le site TMDB.
Rendez-vous sur https://www.themoviedb.org/signup et créez un compte.

**Entrez un email valide car vous devrez valider son existence.**

Une fois votre compte créé, il faut faire une demande de clé API : https://www.themoviedb.org/settings/api/new?type=developer.
Celle-ci devrait être automatiquement acceptée, mais il vous est tout de même demandé de renseigner pourquoi vous souhaitez utiliser l'API.

Pour remplir le formulaire, choisissez :
Type of use : Personal

Entrez un nom qui vous convient et en URL vous pouvez renseigner l'url `localhost:3000`.
Mettez une petite description de pourquoi vous souhaitez utiliser l'application (par exemple: `To participate to a dojo about nextjs`)

Vous devez ensuite renseigner des informations personnelles.
A vous de choisir si vous souhaitez remplir avec des vraies infos ou du lorem ipsum. Aucune vérification n'est effectuée derrière.

Après avoir soumis le formulaire vous devriez avoir accès à vos clés d'API.
Pour ce tutoriel nous aurons besoin de `API Read Access Token (v4 auth)`.

### De l'authentification très rapidement à l'aide du provider GitHub.

NextAuth nous permet de mettre en place de l'authentification sur notre application très facilement avec OAuth. Pour pouvoir faire cela cependant, il nous faut un provider. Vous avez très certainement un compte GitHub, nous utiliserons donc ce provider, cependant il est possible d'utiliser Google, Discord, et même Slack ! ;)
Vous pouvez aussi utiliser un provider maison.

Il nous faudra répertorier deux applications chez GitHub : une application locale pour le développement, et une application pour la production.

Répertorions ensemble l'application pour le développement à [cette adresse](https://github.com/settings/applications/new).

![github_dev_app_creation](en/images/github_dev_app_creation.png)

Ceci nous permettra de nous authentifier même en local.

GitHub vous redirige vers une page sur laquelle vous trouverez le "client ID" de votre application, et pourrez générer un nouveau "client secret".

Nous ferons la même opération pour votre application en production un peu plus tard.

### Installation du boilerplate de notre application à l'aide de create-t3-app

Pour cette application, nous utiliserons la [T3 stack](https://create.t3.gg/) (sans Tailwind, je ne suis pas un grand fan de Tailwind. Peut-être un jour ?). Nous avons déjà explicité les différents modules présents dans la T3 stack plus haut : Next.js, Prisma, NextAuth, tRPC, TypeScript (T3 vient de TypeScript, tRPC, Tailwind).

Pour lancer une application T3, utilisons pnpm dans le dossier de votre choix :

`pnpm create t3-app`

Le CLI vous guide, configurez votre boilerplate comme ceci :

![pnpm_create_t3_app](en/images/pnpm_create_t3_app.png)

## Configuration des outils

Plus qu'un peu de configuration et nous pourrons commencer à développer notre application.

### Variables d'environnement

Dupliquez le fichier `.env.example` à la racine de ce repository et renommez le en `.env`.
La T3-stack fournit un petit module très pratique, qui parse les variables d'environnement et les valide avec Zod. Ceci permet de détecter les problèmes de configuration au démarrage du serveur plutôt que durant le runtime.

Pour ajouter une variable d'environnement, il faut donc l'ajouter à deux endroits : le fichier `.env`, et le fichier `schema.mjs` dans le dossier `src/env`.

#### Base de donnnées

Pour les liens de base de données, rendez-vous sur l'interface "Dashboard" de Neon et récupérez les "Connection string" des 2 bases de données (classique et shadow).
Celles-ci devraient avoir cette forme `postgres://{username}@{host}/{dbname}`.

Il manque donc le mot de passe et si vous ne l'avez pas noté lors des précédentes étapes de configuration, vous pouvez facilement le réinitialiser.

Une fois le mot de passe en votre possession, modifier les "Connection string" pour qu'elles aient la forme suivante : `postgres://{username}:{password}@{host}/{dbname}`.
Renseignez-les après le `=` des variables d'environnement explicitement nommées `DATABASE_URL` et `SHADOW_DATABASE_URL`.

#### API TMDB

Renseignez la clé d'API `API Read Access Token (v4 auth)` après `TMDB_BEARER_TOKEN=`.
Pour l'URL : `TMDB_API_BASE_URL=https://api.themoviedb.org/3`.

#### Next Auth

Nous utiliserons l'URL d'authentification suivante `NEXTAUTH_URL=http://localhost:3000`.
Vous aurez aussi besoin d'un `NEXTAUTH_SECRET`. Celui-ci sert à saler les données quand elles sont rentrées en base. Si vous avez accès à des commandes Linux, vous pouvez utiliser la commande `openssl rand -base64 32` pour générer ce secret. Sinon, utilisez celui-ci : `qGATo8sXj7nPjGUa36u8rGZ+nLWWnJEWPLgB5Wb2q8w=`

## Développement

Il est maintenant temps de coder ! Préparez vos claviers :)

### Frontend

Pour la partie front, commençons par la création de la page d'accueil.

#### Layout

Comme j'aimerais que mon site ait un design similaire sur toutes les pages et que certains éléments appairaissent sur toutes les pages, nous allons créer un layout. Ce layout comprendra un header et un body.
Comme nous souhaitons que ce layout soit appliqué sur toutes les pages, nous allons devoir englober nos composants rendus par l'application, dans le return de `src/pages/_app.tsx`.
Le layout est défini ici : `src/layout/ContentLayout.tsx`.

#### Composants

La création de composants est une importante partie de la philosophie de création d'une application avec React. Ils permettent notamment de bien séparer vos morceaux de code d'UI et/ou de logique.
Nous allons donc essayé d'en créer plusieurs lors de ce dojo.
Ils sont créés dans le dossier `src/components`.

### NextJS

#### Routes

Les routes NextJS sont déclarées dans le dossier `pages` d'un projet NextJS. L'arborescence qui découle définira le routage des urls de l'application.
Par exemple :
`pages/movies/` sera accessible par l'URL `/movies`.

#### Pages avec routes dynamiques

Pour accéder à une page de détail d'un objet de votre arborescence, vous pouvez créer des routes des dynamiques.
Pour les déclarer il faut nommer votre fichier/dossier de la sorte `[param]` (nom du query parameter entre crochets) où `param` correspond à la clé dans l'objet `query` renvoyé par l'objet `router` de NextJS.
Il est possible d'avoir plusieurs routes dynamiques imbriquées. Attention dans ce cas à ne pas nommer vos variables avec le même nom.

Exemple :
`pages/movies/[movieId]/ratings/[ratingId]`
https://nextjs.org/docs/routing/dynamic-routes

### Schéma Prisma

La toute première chose que nous allons vouloir faire durant le développement est de créer votre modèle.

Dans le dossier `prisma` à la racine de votre projet, modifiez le fichier `schema.prisma`.
/!\ Attention ! Nous utilisons le provider GitHub qui nécessite un attribut en plus dans le modèle `Account` : `refresh_token_expires_in Int?`

### Notre page d'accueil
#### Backend : notre premier routeur tRPC

Puisque nous souhaitons afficher des films sur la page d'accueil, il nous faut faire une requête à l'API TMDB.

Or, comme nous l'avons dit plus tôt, le token de l'API TMDB est unique. 
Autrement dit, c'est notre *application* qui est autorisée et pas chaque utilisateur de notre application. 
Il nous faut donc cacher ce token, sinon il pourrait être utilisé en notre nom. Si les requêtes partent directement depuis le navigateur de vos utilisateurs avec ce token, un utilisateur serait capable de le récupérer. La requête doit donc partir d'un endroit où l'utilisateur n'a pas accès... Avez-vous une idée ? Exactement : le serveur.

Comment peut-on faire ça ? C'est assez simple : nous allons faire un point d'API qui fait lui-même cet appel à l'API TMDB et qui va renvoyer les données au frontend, sans jamais communiquer le token au navigateur.

Créons ensemble un routeur tRPC qui s'appelle `movies.ts`, dans le dossier suivant : `src/server/api/routers`.

Voici un example très basique d'un point d'API tRPC :

```TypeScript
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";


export const moviesRouter = createTRPCRouter({
  hello: publicProcedure.input(
    z.object({
      who: z.string(),
    })
  ).query(({ input }) => {
    return { hello: `Hello ${input.who}!`}
  })
});
```

L'une des raisons pour lesquelles tRPC a une Developer eXperience (DX) aussi agréable est l'abstraction. Une fois que tRPC est mis en place, vous n'avez plus en tant que développeur à vous soucier de *comment* fonctionne votre API. Bien entendu, il est important de **comprendre**, mais les détails d'implémentation de l'API ne devraient pas faire partie de la charge mentale du développeur lorsqu'il est en train de coder les points d'API eux-mêmes.

Regardez à quel point il est facile d'appeler ce point d'API depuis un component :

```TypeScript React
import { api } from "../../utils/api";
// or wherever your declaration of 'api' is

export const MyComponent = () => {
  const { data, isLoading, isError } = api.movies.hello.useQuery({ who: "reader" });

  // You can render conditionally depending on isLoading and error :

  if(error){
    return(<>An error occurred.</>)
  }

  if(isLoading){
    return(<>Loading...</>)
  }

  return(<>{data.hello}</>)
}
```

Revenons-en à *notre* utilisation de tRPC.
Nous allons créer ensemble un point d'API protégé par de l'authentification, et si l'utilisateur est authentifié, fait l'appel à l'API de TMDB puis renvoie les données reçues.
Pour la page d'accueil, disons que nous voulons les données des films les plus "populaires" du moment.

```TypeScript
import { z } from "zod";

import { env } from "../../../env/server.mjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const movieSchema = z.object({
  id: z.number(),
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.union([z.string(), z.date()]),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_count: z.number(),
  vote_average: z.number(),
  popularity: z.number(),
});

export type Movie = z.infer<typeof movieSchema>;

export const listResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

export const moviesRouter = createTRPCRouter({
  getPopular: protectedProcedure.query(async () => {
    const headers = { Authorization: `Bearer ${env.TMDB_BEARER_TOKEN}` };

    const response = await fetch(`${env.TMDB_API_BASE_URL}/movie/popular`, {
      headers: headers,
    });

    const parsedData = listResponseSchema.parse(await response.json());

    return parsedData.results;
  }),
});
```

> Oh ! Attends une minute, il y a beaucoup plus de choses qu'avant !

Je sais, ne t'en fais pas, je vais t'expliquer tout ce qui se passe ici block par block :

```TypeScript
...
import { z } from "zod";
...

export const movieSchema = z.object({
  id: z.number(),
  poster_path: z.string(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.union([z.string(), z.date()]),
  genres: z.array(z.object({ id: z.number(), name: z.string() })).nullish(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_count: z.number(),
  vote_average: z.number(),
  popularity: z.number(),
});

export type Movie = z.infer<typeof movieSchema>;

export const listResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_results: z.number(),
  total_pages: z.number(),
});

...

```
Si vous n'utilisez pas encore Zod dans vos projets frontend, vous devriez essayer. Zod est une bibliothèque de validation de schémas.
Zod s'interface avec le système de types de TypeScript pour fournir de la validation plus poussée que TypeScript, en gardant une DX très agréable.

En l'occurrence ici, nous avons besoin d'assigner un type à la réponse de l'API TMDB. Nous pourrions utiliser le système de type de TypeScript, mais Zod nous permet ici de vérifier le schéma *au runtime* en plus, et de raise une erreur si jamais la réponse ne correspond pas au schéma exact que nous lui avons donné.

Cependant, la réponse évidente d'un développeur serait à ce moment : "Mais je vais devoir écrire mes types plusieurs fois ! Et dans plusieurs syntaxes différentes !"

Non. Car Zod a prévu ceci : lorsque vous voulez déclarer un type (au sens de TypeScript), vous pouvez inférer ce type depuis son schéma, comme nous le faisons pour le type Movie.

Une fois ces schémas & types déclarés, nous pouvons typer *réellement* (de manière sûre !) la réponse de l'API de cette manière :

```TypeScript
const parsedData = listResponseSchema.parse(await response.json());

return parsedData.results;
```
Magnifique ! Zod a typé notre 'parsedData' par inférence !
Nous pouvons retourner 'results' de manière sûre car nous avons vérifié qu'il existait réellement à l'aise de la méthode .parse du schéma.

> **__ATTENTION :__** En production, tâchez d'englober tout ce qui pourrait raise (throw) une erreur dans des blocs `try catch`.

"Super ! Mais ça ne m'explique pas comment l'authentification fonctionne..."

L'authentification est cachée derrière ceci :
```TypeScript
...
getPopular: protectedProcedure.query
...
```
Si vous allez chercher dans le fichier `src\server\api\trpc.ts`, vous y trouverez ce code :
```TypeScript
/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
```

Les petits malins de la T3-stack ont été assez gentils pour nous coder ça pour nous ! Ce qui se passe réellement c'est que nous utilisons un middleware pour vérifier la session de l'utilisateur. Le middleware nous passe carrément la session et l'utilisateur pour que nous puissions réutiliser ces informations dans les points d'API protégés. Sympathique non ?

Une fois ce point d'API créé, il convient de l'utiliser dans un component (à quoi bon servirait-il autrement ?).

Dans le fichier `src/pages/index.ts`, utilisons cette procédure :

```TypeScript
import { type NextPage } from "next";
import MovieCollection from "../components/collection/movies/MovieCollection";
import { api } from "../utils/api";
import styles from "./index.module.css";

const Home: NextPage = () => {
  const { data, isLoading, isError, error } = api.movies.getPopular.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <h1 className={styles.title}>Popular movies</h1>
      <MovieCollection movies={data} />
    </>
  );
};

export default Home;
```
Nous parlerons juste après du composant React nommé `MovieCollection`.

Vous remarquerez que, sans jamais déclarer ni importer le type de `data` dans votre code React, celui-ci est déjà typé. C'est ça la beauté de tRPC : les types de votre frontend et de votre backend sont synchronisés sans jamais avoir à le faire vous-même.
Cela signifie aussi que si vous changez le type dans votre backend sans le faire dans votre frontend alors des erreurs arriveront **lors de la phase de développement**. Avant même la phase de build ou de test. Bien entendu, les erreurs arriveront aussi lors du build (et lors des tests si vous faites correctement vos tests).  

#### Frontend : une superbe page d'accueil.

<!-- TODO: Page d'accueil (expliquer ce qu'on veut y faire, parler du composant MovieCollection) -->

### Création de listes, et rangement de films dans des listes.

Comme nous l'avons précisé plus tôt, l'objectif de cette application n'est pas juste d'afficher des films, mais bien d'être un *outil* de classification de films dans des listes pour l'utilisateur.
Pour ceci, il ne faut pas juste consulter des données, il faut en stocker. Plus précisément, il faut pouvoir créer, modifier et supprimer ces classifications.

Dans tRPC, un endpoint qui permet ceci est appelé une **mutation**.
La syntaxe d'une mutation est très proche de celle d'une query dans le backend. 

<!-- TODO: Explication de la mutation que l'on veut créer, et du call Prisma -->
## Déploiement Vercel

### Création et configuration de compte

- Créer un compte chez Vercel : https://vercel.com. Avec votre compte GitHub vous pourrez directement donner accès à vos repositories à Vercel.
  - Si authentification avec GitHub (ou autre site de contrôle de version) : autorisez tout ou partie de vos repositories.
  - Si authentification par mail : vous pourrez donner l'URL d'un repository via son URL publique.
- Créer un nouveau projet : https://vercel.com/new

  - Si authentification par mail, cliquez sur "Import Third-Party Git Repostiory", et entrez l'URL publique du repository souhaité.
    ![vercel_email_authent_new_project](fr/images/vercel_email_authent_new_project.png)

  - Si authentification par GitHub, importez le repository souhaité via le bouton "import" en face du nom du repository, ou ajoutez le via les droits accordés à Vercel.
    ![vercel_github_authent_new_project](fr/images/vercel_github_authent_new_project.png)

### Configuration du projet

![vercel_configure_project](fr/images/vercel_configure_project.png)

1. Nommez votre project comme bon vous semble. A noter que ce sera l'URL de votre projet (en version Hobby), où l'URL sera de la forme : https://{project_name}.vercel.app/
2. Insérez vos variables d'environnement qui se trouvent dans le fichier `.env` précédement configuré.
   La variable `NEXTAUTH_URL` n'est pas nécessaire quand le déploiement est sur Vercel.
   Il faut cependant en créer une autre : `NEXTAUTH_SECRET`.
    **Veuillez suivre cette documentation pour en comprendre d'avantage : https://next-auth.js.org/deployment#vercel**

Une fois ces étapes effectuées, cliquez sur "Deploy".
Vous pourrez suivre l'état d'avancement du déploiement et serez notifié d'une erreur ou du succès de l'opération.

Si tout se passe bien vous aurez accès à votre application déployée.

_Toutes ces opérations peuvent être effectuées via la CLI de Vercel : https://vercel.com/docs/cli/deploying-from-cli_
