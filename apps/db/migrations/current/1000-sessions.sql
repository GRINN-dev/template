/*
 * The sessions table is used to track who is logged in, if there are any
 * restrictions on that session, when it was last active (so we know if it's
 * still valid), etc.
 *
 * In Starter we only have an extremely limited implementation of this, but you
 * could add things like "last_auth_at" to it so that you could track when they
 * last officially authenticated; that way if you have particularly dangerous
 * actions you could require them to log back in to allow them to perform those
 * actions. (GitHub does this when you attempt to change the settings on a
 * repository, for example.)
 *
 * -- The primary key is a cryptographically secure random uuid; the value of this
 * -- primary key should be secret, and only shared with the user themself. We
 * -- currently wrap this session in a webserver-level session (either using
 * -- redis, or using `connect-pg-simple` which uses the
 * -- `connect_pg_simple_sessions` table which we defined previously) so that we
 * -- don't even send the raw session id to the end user, but you might want to
 * -- consider exposing it for things such as mobile apps or command line
 * -- utilities that may not want to implement cookies to maintain a cookie
 * -- session.
 * 
 * Here we defer from the graphile starter and use a JWT token instead of a session id. 
 * So this table stores the refresh token to enable refresh token rotation.
 * The refresh token is generated on the webserver and is stored in the database.
 */

create table priv.sessions (
  uuid uuid not null default gen_random_uuid() primary key,
  user_id uuid not null,
  refresh_token text, -- not marked as not null as it is updated on successful login
  -- You could add access restriction columns here if you want, e.g. for OAuth scopes.
  created_at timestamptz not null default now(),
  refresh_count integer not null default 0,
  last_refresh timestamptz not null default now()
);
alter table priv.sessions enable row level security;

-- To allow us to efficiently see what sessions are open for a particular user.
create index on priv.sessions (user_id);
-- To allow us to efficiently validate a given refresh token.
create index on priv.sessions (refresh_token);
