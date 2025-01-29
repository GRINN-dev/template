/*
 * A user account may be created explicitly via the GraphQL `register` mutation
 * (which calls `really_create_user` below), or via OAuth (which, via
 * `installPassportStrategy.ts`, calls link_or_register_user below, which may
 * then call really_create_user). Ultimately `really_create_user` is called in
 * all cases to create a user account within our system, so it must do
 * everything we'd expect in this case including validating username/password,
 * setting the password (if any), storing the email address, etc.
 */

create function priv.really_create_user(
  email citext,
  password text
) returns publ.users as $$
declare
  v_user publ.users;
begin
  if password is not null then
    perform priv.assert_valid_password(password);
  end if;
  if email is null then
    raise exception 'Email is required' using errcode = 'MODAT';
  end if;

  -- Insert the new user
  insert into publ.users (email) values
    (really_create_user.email)
    returning * into v_user;

  -- Store the password
  if password is not null then
    update priv.user_secrets
    set password_hash = crypt(password, gen_salt('bf'))
    where user_id = v_user.id;
  end if;

  -- Refresh the user
  select * into v_user from publ.users where id = v_user.id;

  return v_user;
end;
$$ language plpgsql volatile set search_path to pg_catalog, public, pg_temp;

comment on function priv.really_create_user(email citext, password text) is
  E'Creates a user account. All arguments are optional, it trusts the calling method to perform sanitisation.';

/**********/

