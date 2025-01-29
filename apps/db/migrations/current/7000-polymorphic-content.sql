create table publ.content_type (
    type text primary key,
    description text
);
grant select on publ.content_type to :DATABASE_AUTHENTICATOR;
comment on table publ.content_type is E'@enum';

insert into publ.content_type values
    ('ARTICLE', 'Article'),
    ('PODCAST', 'Podcast'),
    ('VIDEO', 'Video');

create table publ.contents (
    id uuid not null default uuid_generate_v4() primary key unique,

    -- This column is used to tell us which table we need to join to
    type text not null references publ.content_type(type) default 'ARTICLE',

    -- Shared attributes (also 'id'):
    title text not null,
    duration_in_seconds int,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    is_explicitly_archived bool not null default false,
    archived_at timestamptz,
    is_a_tool bool not null default false,
    image_id uuid references publ.assets(id) on delete set null
);

alter table publ.contents enable row level security;

create index on publ.contents (created_at);
create index on publ.contents (updated_at);
create index on publ.contents (is_explicitly_archived);
create index on publ.contents (archived_at);
create index on publ.contents (is_a_tool);
create index on publ.contents (image_id);
create index on publ.contents (type);

create table publ.articles (
    id uuid primary key references publ.contents on delete cascade,
    body jsonb not null
);

alter table publ.articles enable row level security;

create table publ.podcasts (
    id uuid primary key references publ.contents on delete cascade,
    podcast_id uuid not null references publ.assets(id) on delete cascade,
    transcript text
);

alter table publ.podcasts enable row level security;


create table publ.videos (
    id uuid primary key references publ.contents on delete cascade,
    vimeo_id text not null,
    transcript text
);

alter table publ.videos enable row level security;

comment on table publ.contents is $$
  @interface mode:relational type:type
  @type PODCAST references:podcasts
  @type VIDEO references:videos
  @type ARTICLE references:articles
  $$;

--!include /rbac/contents.sql 
--!include /policies/contents.sql
--!include /custom-mutations/contents.sql