/*
 * When a user forgets their password we want to let them set a new one; but we
 * need to be very careful with this. We don't want to reveal whether or not an
 * account exists by the email address, so we email the entered email address
 * whether or not it's registered. If it's not registered, we track these
 * attempts in `unregistered_email_password_resets` to ensure that we don't
 * allow spamming the address; otherwise we store it to `user_email_secrets`.
 *
 * `publ.forgot_password` is responsible for checking these things and
 * queueing a reset password token to be emailed to the user. For what happens
 * after the user receives this email, see instead `priv.reset_password`.
 *
 * NOTE: unlike priv.login and priv.reset_password, rolling back
 * the results of this function will not cause any security issues so we do not
 * need to call it indirectly as we do for those other functions. (Rolling back
 * will undo the tracking of when we sent the email but it will also prevent
 * the email being sent, so it's harmless.)
 */

create function publ.forgot_password(email citext) returns void as $$
declare
  v_user publ.users;
  v_token text;
  v_token_min_duration_between_emails interval = interval '3 minutes';
  v_token_max_duration interval = interval '3 days';
  v_now timestamptz = clock_timestamp(); -- Function can be called multiple during transaction
  v_latest_attempt timestamptz;
begin
  -- Find the matching user:
  select users.* into v_user
  from publ.users
  where users.email = forgot_password.email
  order by id desc;

  -- If there is no match:
  if v_user is null then
    raise exception 'No account found with email %', forgot_password.email;
  end if;

  -- There was a match.
  -- Fetch or generate reset token:
  update priv.user_secrets
  set
    reset_password_token = (
      case
      when reset_password_token is null or reset_password_token_generated < v_now - v_token_max_duration
      then encode(gen_random_bytes(7), 'hex')
      else reset_password_token
      end
    ),
    reset_password_token_generated = (
      case
      when reset_password_token is null or reset_password_token_generated < v_now - v_token_max_duration
      then v_now
      else reset_password_token_generated
      end
    )
  where user_id = v_user.id
  returning reset_password_token into v_token;

  -- Trigger email send:
  perform graphile_worker.add_job(
    'user__forgot_password',
    json_build_object('id', v_user.id, 'email', v_user.email::text, 'token', v_token)
  );

end;
$$ language plpgsql strict security definer volatile set search_path to pg_catalog, public, pg_temp;

comment on function publ.forgot_password(email public.citext) is
  E'If you''ve forgotten your password, give us one of your email addresses and we''ll send you a reset token. Note this only works if you have added an email address!';

grant execute on function publ.forgot_password(citext) to :DATABASE_VISITOR;