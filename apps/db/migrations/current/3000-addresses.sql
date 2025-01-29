/* 
  TABLE: publ.countries
  DESCRIPTION: 
*/
drop table if exists publ.countries cascade;
create table publ.countries (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.countries enable row level security;

-- indexes
create index on publ.countries(name);
create index on publ.countries(created_at);
create index on publ.countries(updated_at);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.countries
  for each row
  execute procedure priv.tg__timestamps();

/* 
  END TABLE: publ.countries
*/

/* 
  TABLE: publ.regions
  DESCRIPTION: 
*/
drop table if exists publ.regions cascade;
create table publ.regions (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  country_id uuid not null references publ.countries(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.regions enable row level security;

-- indexes
create index on publ.regions(name);
create index on publ.regions(created_at);
create index on publ.regions(updated_at);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.regions
  for each row
  execute procedure priv.tg__timestamps();

/* 
  END TABLE: publ.regions
*/

/* 
  TABLE: publ.districts
  DESCRIPTION: 
*/
drop table if exists publ.districts cascade;
create table publ.districts (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  zip_code text not null,
  region_id uuid not null references publ.regions(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.districts enable row level security;

-- indexes
create index on publ.districts(name);
create index on publ.districts(zip_code);
create index on publ.districts(created_at);
create index on publ.districts(updated_at);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.districts
  for each row
  execute procedure priv.tg__timestamps();

/* 
  END TABLE: publ.districts
*/

/* 
  TABLE: publ.cities
  DESCRIPTION: 
*/
drop table if exists publ.cities cascade;
create table publ.cities (
  id uuid not null default uuid_generate_v4() primary key unique,
  name text not null,
  zip_code text not null,
  latitude float not null,
  longitude float not null,
  district_id uuid not null references publ.districts(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.cities enable row level security;

-- indexes
create index on publ.cities(name);
create index on publ.cities(zip_code);
create index on publ.cities(created_at);
create index on publ.cities(updated_at);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.cities
  for each row
  execute procedure priv.tg__timestamps();

/* 
  END TABLE: publ.cities
*/

/* 
  TABLE: publ.addresses
  DESCRIPTION: 
*/
drop table if exists publ.addresses cascade;
create table publ.addresses (
  id uuid not null default uuid_generate_v4() primary key unique,
  first_line text not null,
  second_line text,
  zip_code text not null,
  latitude float not null,
  longitude float not null,
  city_id uuid not null references publ.cities(id) on delete cascade,
  formatted_address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table publ.addresses enable row level security;

-- indexes
create index on publ.addresses(first_line);
create index on publ.addresses(zip_code);
create index on publ.addresses(created_at);
create index on publ.addresses(updated_at);

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.addresses
  for each row
  execute procedure priv.tg__timestamps();

-- RBAC
--!include rbac/addresses.sql

-- RLS
--!include policies/addresses.sql

/* 
  END TABLE: publ.addresses
*/