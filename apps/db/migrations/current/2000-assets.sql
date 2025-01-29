/*
  TABLE: publ.asset_folders
  DESCRIPTION: Folders that contain assets or other folders.
*/
drop table if exists publ.asset_folders cascade;
create table publ.asset_folders (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  slug text unique not null default '',
  parent_id uuid references publ.asset_folders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.asset_folders enable row level security;

create index on publ.asset_folders (slug);
create index on publ.asset_folders (parent_id);

-- we initialize the root folder
insert into publ.asset_folders (name, slug) values ('root', 'root');

comment on table publ.asset_folders is
  E'Folders that contain assets or other folders.';

-- indexes

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.asset_folders
  for each row
  execute procedure priv.tg__timestamps();

/* 
  END TABLE: publ.asset_folders
*/

/*
  TABLE: publ.assets
  DESCRIPTION: Assets (images and documents) that are used in the application.
*/
drop table if exists publ.assets cascade;
create table publ.assets (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  url text not null,
  key text not null, -- fin de l'url après le /
  mime_type text not null,
  size int not null,
  formats jsonb, -- sm :{url, size, width, height}, md: {}, lg: {}, thumbnail: {}
  alt text not null, -- used for the alt attribute
  caption text, -- used for the figcaption
  height int,
  width int,
  -- credits text,
  asset_folder_id uuid references publ.asset_folders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.assets enable row level security;


create index on publ.assets(asset_folder_id);

comment on table publ.assets is
  E'Assets (images and documents) that are used in the application.';
comment on column publ.assets.id is
  E'Unique identifier for the asset.';
comment on column publ.assets.name is
  E'The name of the asset.';
comment on column publ.assets.url is
  E'The URL of the asset stored in the S3 bucket.';
comment on column publ.assets.key is
  E'The key of the asset.';
comment on column publ.assets.mime_type is
  E'The MIME type of the asset.';
comment on column publ.assets.size is
  E'The size of the asset in bytes.';
comment on column publ.assets.formats is
  E'The formats sm, md, lg, thumbnail of the asset.';
comment on column publ.assets.alt is
  E'The alt attribute of the asset.';
comment on column publ.assets.caption is
  E'The caption of the asset.';
comment on column publ.assets.height is
  E'The height of the asset in pixels.';
comment on column publ.assets.width is
  E'The width of the asset in pixels.';

-- indexes

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.assets
  for each row
  execute procedure priv.tg__timestamps();

-- RBAC
--!include rbac/assets.sql

-- RLS
--!include policies/assets.sql

/* 
  END TABLE: publ.assets
*/


-- insert some asset folders
insert into publ.asset_folders (name, slug, parent_id) values
  ('Images', 'images', (select id from publ.asset_folders where slug = 'root')),
  ('Documents', 'documents', (select id from publ.asset_folders where slug = 'root'));

insert into publ.asset_folders (name, slug, parent_id) values
  ('Images 2', 'images-2', (select id from publ.asset_folders where slug = 'images')),
  ('Documents 2', 'documents-2', (select id from publ.asset_folders where slug = 'documents'));

insert into publ.asset_folders (name, slug, parent_id) values
  ('Images 3', 'images-3', (select id from publ.asset_folders where slug = 'images')),
  ('Documents 3', 'documents-3', (select id from publ.asset_folders where slug = 'documents-2'));

-- insert some assets
insert into publ.assets (name, url, key, mime_type, size, formats, alt, caption, asset_folder_id) values
  (
    'Grinn logo',
    'https://grinn.tech/assets/images/logo.png',
    'logo.png',
    'image/png',
    12345,
    '{"sm": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 100, "height": 100}, "md": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 200, "height": 200}, "lg": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 400, "height": 400}, "thumbnail": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 50, "height": 50}}',
    'Grinn logo',
    'Grinn logo',
    (select id from publ.asset_folders where slug = 'root')
  ),
  (
    'Grinn logo 2',
    'https://grinn.tech/assets/images/logo.png',
    'logo.png',
    'image/png',
    12345,
    '{"sm": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 100, "height": 100}, "md": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 200, "height": 200}, "lg": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 400, "height": 400}, "thumbnail": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 50, "height": 50}}',
    'Grinn logo 2',
    'Grinn logo 2',
    (select id from publ.asset_folders where slug = 'root')
  );

-- insert some assets in children folders

insert into publ.assets (name, url, key, mime_type, size, formats, alt, caption, asset_folder_id) values
  (
    'Grinn logo 3',
    'https://grinn.tech/assets/images/logo.png',
    'logo.png',
    'image/png',
    12345,
    '{"sm": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 100, "height": 100}, "md": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 200, "height": 200}, "lg": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 400, "height": 400}, "thumbnail": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 50, "height": 50}}',
    'Grinn logo 3',
    'Grinn logo 3',
    (select id from publ.asset_folders where slug = 'images')
  ),
  (
    'Grinn logo 4',
    'https://grinn.tech/assets/images/logo.png',
    'logo.png',
    'image/png',
    12345,
    '{"sm": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 100, "height": 100}, "md": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 200, "height": 200}, "lg": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 400, "height": 400}, "thumbnail": {"url": "https://grinn.tech/assets/images/logo.png", "size": 12345, "width": 50, "height": 50}}',
    'Grinn logo 4',
    'Grinn logo 4',
    (select id from publ.asset_folders where slug = 'images-2')
  );
