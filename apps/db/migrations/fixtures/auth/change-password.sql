/*
 * To change your password you must specify your previous password. The form in
 * the web UI may confirm that the new password was typed correctly by making
 * the user type it twice, but that isn't necessary in the API.
 */

create function publ.change_password(old_password text, new_password text) returns boolean as $$
declare
  v_user publ.users;
  v_user_secret priv.user_secrets;
begin
  select users.* into v_user
  from publ.users
  where id = publ.current_user_id();

  if not (v_user is null) then
    -- Load their secrets
    select * into v_user_secret from priv.user_secrets
    where user_secrets.user_id = v_user.id;

    if v_user_secret.password_hash = crypt(old_password, v_user_secret.password_hash) then
      perform priv.assert_valid_password(new_password);

      -- Reset the password as requested
      update priv.user_secrets
      set
        password_hash = crypt(new_password, gen_salt('bf'))
      where user_secrets.user_id = v_user.id;

      -- Revoke all other sessions
      delete from priv.sessions
      where sessions.user_id = v_user.id
      and sessions.uuid <> publ.current_session_id();

      -- Notify user their password was changed
      perform graphile_worker.add_job(
        'user__audit',
        json_build_object(
          'type', 'change_password',
          'user_id', v_user.id,
          'current_user_id', publ.current_user_id()
        ));

      return true;
    else
      raise exception 'Incorrect password' using errcode = 'CREDS';
    end if;
  else
    raise exception 'You must log in to change your password' using errcode = 'LOGIN';
  end if;
end;
$$ language plpgsql strict volatile security definer set search_path to pg_catalog, public, pg_temp;

comment on function publ.change_password(old_password text, new_password text) is
  E'Enter your old password and a new password to change your password.';

grant execute on function publ.change_password(text, text) to :DATABASE_VISITOR;
