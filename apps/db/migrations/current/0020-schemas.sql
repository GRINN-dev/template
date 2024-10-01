/*
 * Read about our publ/hidd/priv schemas here:
 * https://www.graphile.org/postgraphile/namespaces/#advice
 *
 * Note this pattern is not required to use PostGraphile.
 */

create schema publ;
create schema hidd;
create schema priv;

-- The 'visitor' role (used by PostGraphile to represent an end user) may
-- access the public, publ and hidd schemas (but _NOT_ the
-- priv schema).
grant usage on schema public, publ, hidd to :DATABASE_VISITOR;
grant usage on schema public, publ, hidd to :DATABASE_AUTHENTICATOR;

-- We want the `visitor` role to be able to insert rows (`serial` data type
-- creates sequences, so we need to grant access to that).
alter default privileges in schema public, publ, hidd
  grant usage, select on sequences to :DATABASE_VISITOR;
