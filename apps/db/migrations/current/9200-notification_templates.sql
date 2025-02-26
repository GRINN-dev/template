/*
  TABLE: publ.notification_template
  DESCRIPTION: tables des templates de notifications qui sont envoyées aux utilisateurs
*/
drop table if exists publ.notification_templates cascade;
create table publ.notification_templates (
    id uuid not null default uuid_generate_v4() primary key unique, 
    key text not null unique,
    title text not null,
    body text not null,
    url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- indexes
    create index on publ.notification_templates(key);
    create index on publ.notification_templates(title);
    create index on publ.notification_templates(body);
    create index on publ.notification_templates(url);
  create index on publ.notification_templates(created_at);
  create index on publ.notification_templates(updated_at);

-- RBAC
 --!include rbac/notification_templates.sql


-- triggers
  create trigger _100_timestamps
  before insert or update on publ.notification_templates
  for each row
  execute procedure priv.tg__timestamps();

-- RLS
  alter table publ.notification_templates enable row level security;

--!include policies/notification_templates.sql

-- fixtures

insert into publ.notification_templates (key, title, body, url) values
('NEW_NOTIF', '{{follower_firstname}} {{follower_lastname}} veut rentrer en contact avec vous !', 'voici le body', '/page/index');

/*
  END TABLE: publ.notification_template
*/