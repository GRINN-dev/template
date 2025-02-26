drop table if exists publ.notification_status cascade;
create table publ.notification_status (
  type text primary key,
  description text
);
comment on table publ.notification_status is E'@enum de status de notifications';
grant select on publ.notification_status to :DATABASE_AUTHENTICATOR;
insert into publ.notification_status values
  ('NEW', 'la notification n"a pas encore été envoyée'),
  ('SENT', 'la notification a été envoyée'),
  ('ERROR', 'la notification n"a pas pu être envoyée'),
  ('READ', 'la notification a été lue');

/*
  TABLE: publ.notifications
  DESCRIPTION: this table will store all the notifications sent by the app
*/

drop table if exists publ.notifications cascade;
create table publ.notifications (
  id uuid not null default uuid_generate_v4() primary key unique,
  user_id uuid not null references publ.users on delete cascade,
  notification_template_id uuid references publ.notification_templates on delete set null,
  title text not null,
  body text not null,
  picture text,
  data jsonb,
  status text not null default 'NEW' references publ.notification_status on delete cascade,
  opened_at timestamptz, -- trigger
  expo_ticket_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- indexes
create index on publ.notifications (id);
create index on publ.notifications (user_id);
create index on publ.notifications (status);
create index on publ.notifications (notification_template_id);
create index on publ.notifications (created_at);
create index on publ.notifications (updated_at);

-- RBAC
--!include rbac/notifications.sql

-- triggers
create trigger _100_timestamps
before insert or update on publ.notifications
for each row
execute procedure priv.tg__timestamps();


-- RLS
alter table publ.notifications enable row level security;

-- policies
--!include policies/notifications.sql

--triggers
--!include triggers/notifications.sql
