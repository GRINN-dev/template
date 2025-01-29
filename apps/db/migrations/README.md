# Migrations

Ce dossier contient les migrations de BDD. Vous travaillerez principalement dans
les dossiers `current/` et `fixtures/`.

## afterReset.sql

Ce fichier est executé une seule fois, lorsque vous réinitialisez (ou créez) votre
base de données. Il accorde actuellement les permissions aux rôles pertinents et
crée les extensions requises. Il est prévu que cela soit exécuté avec les
privilèges de superutilisateur de la base de données, car les utilisateurs normaux
n'ont souvent pas les autorisations suffisantes pour installer des extensions.

## current/\*.sql

C'est ici que vos nouvelles modifications de base de données vont. Elles doivent être idempotentes (pour une explication, [lisez le README de Graphile Migrate](https://github.com/graphile/migrate/blob/main/README.md)). La commande `pnpm dev` surveillera automatiquement ces fichiers et les réexécutera chaque fois qu'ils changent, mettant à jour votre base de données en temps réel. Chaque fichier doit avoir un préfixe entier positif unique, ex: `current/1000-ma-migration.sql`. Ces fichiers sont exécutés dans l'ordre numérique.

**IMPORTANT** : parce que nous utilisons `ignoreRBAC: false` dans la configuration de PostGraphile, les nouvelles tables _n'apparaîtront pas_ tant que vous n'aurez pas accordé les permissions sur celles-ci.

```sql
create table publ.my_new_table (
  id serial primary key,
  my_column text
);

-- Doesn't appear until we add:

grant
  select,
  insert (my_column),
  update (my_column),
  delete
on app_public.my_new_table to :DATABASE_VISITOR;
```

## fixtures/\*.sql

Ce dossier contient les migrations **stateless** (fonctions, procédures, triggers,
etc.) dont la modification n'entraine aucune modification des données déjà stockées
dans la base de données. Ecrire les migrations de cette manière permet
de suivre l'évolution des procédures stockées, des fonctions, des triggers, etc.
dans notre système de suivi de version et de pouvoir revenir dessus sans avoir
à creuser l'histoire des migrations.

Les fixtures ne sont pas exécutées automatiquement par `pnpm dev`, vous devez les
inclure dans les fichiers de migrations de `current/` si vous voulez qu'elles soient
exécutées, à l'aide d'une directive `--!include /path/to/fixtures/my_fixture.sql`.

## committed/\*.sql

Ce dossier contient les migrations qui ont été exécutées et
validées. Vous ne devriez pas modifier ces fichiers directement, mais plutôt
ajouter de nouvelles migrations dans le dossier `current/` et les exécuter
avec `pnpm gm commit`.

Cela appellera `graphile-migrate commit` qui implique de fusionner les
fichiers `current/*.sql` ensemble puis de mettre le résultat dans le dossier `committed`
avec un hash pour empêcher les modifications ultérieures (qui devraient plutôt être faites
avec des migrations supplémentaires).

Si vous n'avez pas encore fusionné vos modifications (et que personne d'autre ne les a exécutées), vous
pouvez exécuter

```bash
pnpm gm uncommit
```

et cela effectuera l'inverse de ce processus afin que vous puissiez modifier les
migrations à nouveau.
