/*
  TABLE: publ.authors
  DESCRIPTION: Authors of blog posts.
*/
drop table if exists publ.authors cascade;
create table publ.authors (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  avatar_id uuid references publ.asset_folders(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.authors enable row level security;

comment on table publ.authors is
  E'Authors of blog posts.';
comment on column publ.authors.id is
  E'Unique identifier for the author.';
comment on column publ.authors.name is
  E'The name of the author.';
comment on column publ.authors.avatar_id is
  E'The avatar of the author.';
comment on column publ.authors.title is
  E'The title of the author.';

-- indexes
create index on publ.authors(name);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.authors
  for each row
  execute procedure priv.tg__timestamps();

/*
  END TABLE: publ.authors
*/

/*
  ENUM TABLE: publ.blog_post_status
  DESCRIPTION: 
*/
drop table if exists publ.blog_post_status cascade;
create table publ.blog_post_status (
  status text primary key,
  description text
);
comment on table publ.blog_post_status is E'@enum';
grant select on publ.blog_post_status to :DATABASE_AUTHENTICATOR;

insert into publ.blog_post_status values
  ('DRAFT', 'The blog post is a draft.'),
  ('PUBLISHED', 'The blog post has been published.'),
  ('ARCHIVED', 'The blog post has been archived.');

/*
  TABLE: publ.blog_posts
  DESCRIPTION: Blog posts.
*/
drop table if exists publ.blog_posts cascade;
create table publ.blog_posts (
  id uuid not null default uuid_generate_v4() primary key unique,
  slug text not null, -- trigger
  title text not null,
  content jsonb,
  status text not null references publ.blog_post_status(status) on delete restrict default 'DRAFT',
  author_id uuid references publ.authors(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.blog_posts enable row level security;
alter table publ.blog_posts add constraint unique_blog_post_slug unique (slug);

comment on table publ.blog_posts is
  E'Blog posts.';
comment on column publ.blog_posts.id is
  E'Unique identifier for the blog post.';
comment on column publ.blog_posts.slug is
  E'The slug of the blog post that is used in the URL.';
comment on column publ.blog_posts.title is
  E'The title of the blog post.';
comment on column publ.blog_posts.content is
  E'The content of the blog post in rich text.';
comment on column publ.blog_posts.status is
  E'The status of the blog post.';
comment on column publ.blog_posts.author_id is
  E'The author of the blog post.';
comment on column publ.blog_posts.published_at is
  E'The date and time the blog post was published.';

-- indexes
create index on publ.blog_posts(title);
create index on publ.blog_posts(slug);
create index on publ.blog_posts(status);
create index on publ.blog_posts(published_at);
create index on publ.blog_posts(created_at);
create index on publ.blog_posts(updated_at);

-- triggers

-- timestamps
  create trigger _100_timestamps
  before insert or update on publ.blog_posts
  for each row
  execute procedure priv.tg__timestamps();

-- slug

-- RBAC
--!include rbac/blog_posts.sql

-- RLS
--!include policies/blog_posts.sql

/*
  END TABLE: publ.blog_posts
*/



