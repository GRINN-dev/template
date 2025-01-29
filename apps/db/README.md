# db

Nous utilisons Postgraphile en mode Database-Driven dans ce projet; donc notre
base de données est primordiale. Ce package inclut toutes les migrations de base
de données (au démarrage dans le dossier `migrations/current`), et utilise le
dossier `fixtures` pour toutes les migrations **stateless** (fonctions,
procédures, triggers, etc.) qui ne sont pas liées à une version spécifique de la
base de données.

## graphile-migrate

Nous utilisons **Graphile Migrate** pour gérer nos migrations. Pour plus
d'informations, veuillez consulter le [README de Graphile Migrate](https://github.com/graphile/migrate/blob/main/README.md)

Should you decide to stick with Graphile Migrate, we strongly encourage you to
[read the Graphile Migrate README](https://github.com/graphile/migrate/blob/main/README.md)

Contrairement à la majorité des autres frameworks de migration, Graphile Migrate
ne vous protège pas contre les erreurs SQL; il vous permet de gérer les
migrations de manière plus flexible, mais cela signifie que vous devez être
beaucoup plus prudent lorsque vous écrivez vos migrations.

[Plus d'infos sur les migrations: `migrations/README.md`.](./migrations/README.md)

## Rôles de la base de données

Graphile Starter utilise trois rôles :

- `DATABASE_OWNER` - c'est le rôle qui possède la base de données (**pas** le
  cluster de base de données, juste la base de données individuelle); c'est-à-dire
  que c'est le rôle qui exécute toutes les migrations et est propriétaire des schémas,
  tables et fonctions résultants.
- `DATABASE_AUTHENTICATOR` - c'est le rôle avec lequel PostGraphile se connecte
  à la base de données; il a des permissions absolument minimales (juste assez
  pour exécuter les requêtes d'introspection et la capacité de "switcher" vers
  `DATABASE_VISITOR` ci-dessous). Lorsqu'une requête GraphQL arrive, nous nous
  connectons à la base de données en tant que `DATABASE_AUTHENTICATOR`, puis nous
  démarrons une transaction et exécutons `SET LOCAL role TO 'DATABASE_VISITOR'`.
  Nous prenons le partie de ne pas utiliser différents roles pour les différentes
  requêtes, il est plus simple de gérer les autorisations ultérieurement en fonction de
  l'utilisateur connecté par l'utilisation de `row level security`.
- `DATABASE_VISITOR` - c'est le rôle sous lequel le SQL généré à partir des
  requêtes GraphQL s'exécute, c'est celui auquel la grande majorité de vos
  `GRANT`s feront référence et auquel les politiques de sécurité au niveau des
  lignes s'appliqueront. Il représente à la fois les utilisateurs connectés et
  non connectés à votre API GraphQL - il est supposé que vos politiques de
  sécurité au niveau des lignes différencieront ces états (et tout autre "rôle
  d'application" que l'utilisateur peut avoir) pour déterminer ce qu'ils sont
  autorisés à faire.

Le rôle `DATABASE_OWNER` est également utilisé pour certaines opérations à
"privilèges élevés" telles que la connexion et l'enregistrement des utilisateurs.
Notez que les fonctions `SECURITY DEFINER` adoptent le niveau de sécurité du rôle
qui a défini la fonction (contrairement à `SECURITY INVOKER` qui utilise la
sécurité du rôle qui invoque la fonction), vous devez donc **vous assurer de
créer tous les schémas, tables, etc. avec le `DATABASE_OWNER` dans tous les
environnements** (local, dev, production), et non avec votre propre rôle
d'utilisateur ni avec le rôle superutilisateur par défaut (souvent nommé
`postgres`). Cela garantit que le système se comporte comme prévu lors du passage
de votre environnement de développement local à des systèmes de base de données
hébergés en production.
