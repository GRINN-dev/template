/*
 * The users table stores (unsurprisingly) the users of our application. You'll
 * notice that it does NOT contain private information such as the user's
 * password or their email address; that's because the users table is seen as
 * public - anyone who can "see" the user can see this information.
 *
 * The author sees `is_admin` and `is_verified` as public information; if you
 * disagree then you should relocate these attributes to another table, such as
 * `user_secrets`.
 */
/*
  TABLE: publ.users
  DESCRIPTION: Users who can log in to the admin application
*/
drop table if exists publ.users cascade;
create table publ.users (
  id uuid primary key default gen_random_uuid(),
  firstname text,
  lastname text,
  email citext not null check (email ~ '[^@]+@[^@]+\.[^@]+'),
  avatar_url text check(avatar_url ~ '^https?://[^/]+'),
  is_admin boolean not null default false,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.users enable row level security;
alter table publ.users add constraint unique_email unique (email);

comment on table publ.users is
  E'A user who can log in to the admin application.';
comment on column publ.users.id is
  E'Unique identifier for the user.';
comment on column publ.users.email is
  E'The users email address, in `a@b.c` format.';
comment on column publ.users.avatar_url is
  E'Optional avatar URL.';
comment on column publ.users.is_admin is
  E'If true, the user has elevated privileges.';

-- We couldn't implement this relationship on the sessions table until the users table existed!
alter table priv.sessions
  add constraint sessions_user_id_fkey
  foreign key ("user_id") references publ.users on delete cascade;

-- indexes
create index on publ.users(firstname);
create index on publ.users(lastname);
create index on publ.users(email);
create index on publ.users(created_at);
create index on publ.users(updated_at);

-- triggers 
create trigger _100_timestamps
  before insert or update on publ.users
  for each row
  execute procedure priv.tg__timestamps();

-- RBAC
--!include rbac/users.sql


-- policies
--!include policies/users.sql

/**********/

-- Returns the current user; this is a "custom query" function; see:
-- https://www.graphile.org/postgraphile/custom-queries/
-- So this will be queryable via GraphQL as `{ currentUser { ... } }`
create function publ.current_user() returns publ.users as $$
  select users.* from publ.users where id = publ.current_user_id();
$$ language sql stable;
comment on function publ.current_user() is
  E'The currently logged in user (or null if not logged in).';

grant execute on function publ.current_user to :DATABASE_VISITOR;

/**********/

-- The users table contains all the public information, but we need somewhere
-- to store private information. In fact, this data is so private that we don't
-- want the user themselves to be able to see it - things like the bcrypted
-- password hash, timestamps of recent login attempts (to allow us to
-- auto-protect user accounts that are under attack), etc.
create table priv.user_secrets (
  user_id uuid not null primary key references publ.users on delete cascade,
  password_hash text,
  last_login_at timestamptz not null default now(),
  failed_password_attempts int not null default 0,
  first_failed_password_attempt timestamptz,
  reset_password_token text,
  reset_password_token_generated timestamptz,
  failed_reset_password_attempts int not null default 0,
  first_failed_reset_password_attempt timestamptz,
  delete_account_token text,
  delete_account_token_generated timestamptz
);
alter table priv.user_secrets enable row level security;
comment on table priv.user_secrets is
  E'The contents of this table should never be visible to the user. Contains data mostly related to authentication.';

/*
 * When we insert into `users` we _always_ want there to be a matching
 * `user_secrets` entry, so we have a trigger to enforce this:
 */
create function priv.tg_user_secrets__insert_with_user() returns trigger as $$
begin
  insert into priv.user_secrets(user_id) values(NEW.id);
  return NEW;
end;
$$ language plpgsql volatile set search_path to pg_catalog, public, pg_temp;
create trigger _500_insert_secrets
  after insert on publ.users
  for each row
  execute procedure priv.tg_user_secrets__insert_with_user();
comment on function priv.tg_user_secrets__insert_with_user() is
  E'Ensures that every user record has an associated user_secret record.';

/*
 * Because you can register with username/password or using OAuth (social
 * login), we need a way to tell the user whether or not they have a
 * password. This is to help the UI display the right interface: change
 * password or set password.
 */
create function publ.users_has_password(u publ.users) returns boolean as $$
  select (password_hash is not null) from priv.user_secrets where user_secrets.user_id = u.id and u.id = publ.current_user_id();
$$ language sql stable security definer set search_path to pg_catalog, public, pg_temp;

/*
 * When the user validates their email address we want the UI to be notified
 * immediately, so we'll issue a notification to the `graphql:user:*` topic
 * which GraphQL users can subscribe to via the `currentUserUpdated`
 * subscription field.
 */
create trigger _500_gql_update
  after update on publ.users
  for each row
  execute procedure publ.tg__graphql_subscription(
    'userChanged', -- the "event" string, useful for the client to know what happened
    'graphql:user:$1', -- the "topic" the event will be published to, as a template
    'id' -- If specified, `$1` above will be replaced with NEW.id or OLD.id from the trigger.
  );
