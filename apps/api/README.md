# @app/server

Le serveur est responsable de :

- l'authentification
- la création du endpoint GraphQL (via
  [PostGraphile](https://graphile.org/postgraphile/), basé sur la base de données dans
  `apps/db`)

Le serveur ne réalise pas de tâches en arrière-plan telles que l'envoi d'emails, cela relève de la
responsabilité de la file d'attente des tâches, qui se trouve dans
[`apps/worker`](../worker/README.md).

## Point d'entrée

Le point d'entrée du serveur est [src/index.ts](src/index.ts). Ce fichier configure
un serveur HTTP et installe notre application express (définie dans
[src/app.ts](src/app.ts)) dedans. L'application express installe les middlewares nécessaires à partir des fichiers src/middleware/\*.ts.

## Getters Express

Les valeurs couramment utilisées sont stockées dans l'application Express elle-même, en utilisant l'API
`app.set(key, value)` d'Express. Malheureusement, cette API ne permet pas une récupération typée,
nous encourageons donc l'utilisation de getters typés personnalisés pour récupérer les
valeurs pertinentes, par exemple :
`function getHttpServer(app: Express): Server | void { return app.get("httpServer"); }`

## Smart Tags PostGraphile

`postgraphile.tags.jsonc` est un
[le fichier de smart tags](https://www.graphile.org/postgraphile/smart-tags-file/) utilisé
pour configurer et façonner notre schéma GraphQL. Le fichier est documenté
(d'où JSONC) ; nous aimerions qu'il soit JSON5 à terme (ce qui devrait être aussi simple que
de renommer le fichier et de laisser prettier le reformater pour nous) mais VSCode ne
supporte pas nativement JSON5 actuellement.

## Plugins PostGraphile

Notre schéma GraphQL utilise un certain nombre de plugins pour des améliorations et des personnalisations ;
ceux-ci peuvent être trouvés dans [src/plugins](./src/plugins).
