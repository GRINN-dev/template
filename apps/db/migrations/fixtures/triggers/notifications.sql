
-- trigger qui insert la date d'ouverture de la notification quand elle est lue
drop function if exists publ.tg__notification_opened_at() cascade;
create function publ.tg__notification_opened_at() returns trigger as $$
begin
  if new.status = 'READ' then
    new.opened_at := now();
  end if;  
  return NEW;
end;
$$ language plpgsql security definer;

create trigger _200_opened_at
after update on publ.notifications
for each row
when (old.status <> new.status and new.status = 'READ')
execute procedure publ.tg__notification_opened_at();

create or replace function publ.tg__send_notification() returns trigger as $$
declare
  v_user publ.users;
  v_notification publ.notifications;
  v_push_token text;
begin
  -- get the user
  select * into v_user from publ.users where id = new.user_id limit 1;
  -- get the notification
  select * into v_notification from publ.notifications where id = new.id;
  -- get the push_token
  select push_token into v_push_token from publ.users where id = new.user_id;

  perform graphile_worker.add_job('send_notification', json_build_object('pushToken', v_push_token, 'title', v_notification.title, 'body', v_notification.body));
  -- return the notification
  return new;
end;
$$ language plpgsql stable security definer;
grant execute on function publ.tg__send_notification to :DATABASE_VISITOR;

drop trigger if exists _300_send_notification on publ.notifications cascade;
create trigger _300_send_notification
after insert on publ.notifications
for each row
when (new.status = 'NEW')
execute procedure publ.tg__send_notification();