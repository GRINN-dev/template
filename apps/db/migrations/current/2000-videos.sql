/*
  TABLE: publ.videos
  DESCRIPTION: 
*/
drop table if exists publ.videos cascade;
create table publ.videos (
    id uuid not null default uuid_generate_v4() primary key unique, 
    video_url text not null,
    title text not null,
    user_id uuid not null references publ.users(id) default publ.current_user_id(),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- indexes
  create index on publ.videos(created_at);
  create index on publ.videos(updated_at);
  create index on publ.videos(user_id);


-- RBAC
  grant select on publ.videos to :DATABASE_VISITOR;
  grant insert (video_url, title, user_id) on publ.videos to :DATABASE_VISITOR;
  grant update (video_url, title) on publ.videos to :DATABASE_VISITOR;

-- triggers
  create trigger _100_timestamps
  before insert or update on publ.videos
  for each row
  execute procedure priv.tg__timestamps();

-- RLS
  alter table publ.videos enable row level security;

 create policy no_limit /*TODO: update policy*/
   on publ.videos
   for all
   using (true)
   with check(true);

-- fixtures
  -- fixtures go here
/*
  END TABLE: publ.videos
*/