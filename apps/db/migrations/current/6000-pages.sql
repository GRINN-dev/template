/*
  ENUM TABLE: publ.page_status
  DESCRIPTION: 
*/
drop table if exists publ.page_status cascade;
create table publ.page_status (
  status text primary key,
  description text
);
comment on table publ.page_status is E'@enum';
grant select on publ.page_status to :DATABASE_AUTHENTICATOR;

insert into publ.page_status values
  ('DRAFT', 'The page is in draft mode.'),
  ('PUBLISHED', 'The page is published.'),
  ('ARCHIVED', 'The page is archived.');

/*
  TABLE: publ.pages
  DESCRIPTION: Pages of the application that are not blog posts or churches or routes.
*/
drop table if exists publ.pages cascade;
create table publ.pages (
  id uuid not null default uuid_generate_v4() primary key unique,
  slug text not null, -- trigger
  status text not null references publ.page_status(status) on delete restrict default 'DRAFT',
  title text not null,
  content jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.pages enable row level security;
alter table publ.pages add constraint unique_page_slug unique (slug);

comment on table publ.pages is
  E'Pages of the application that are not blog posts or churches or routes.';
comment on column publ.pages.id is
  E'Unique identifier for the page.';
comment on column publ.pages.slug is
  E'The slug of the page that is used in the URL.';
comment on column publ.pages.status is
  E'The status of the page.';
comment on column publ.pages.title is
  E'The title of the page.';
comment on column publ.pages.content is
  E'The content of the page in rich text.';

-- indexes
create index on publ.pages(title);
create index on publ.pages(slug);
create index on publ.pages(status);
create index on publ.pages(created_at);
create index on publ.pages(updated_at);

-- triggers

-- timestamp
  create trigger _100_timestamps
  before insert or update on publ.pages
  for each row
  execute procedure priv.tg__timestamps();

-- RBAC
--!include rbac/pages.sql

-- RLS
--!include policies/pages.sql

/*
  END TABLE: publ.pages
*/


