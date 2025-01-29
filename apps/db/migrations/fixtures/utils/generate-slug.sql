-- Create or replace the generate_slug function
create or replace function priv.generate_slug(text) returns text as $$
declare
  slug text;
begin
  slug := translate(lower($1), ' ', '-');
  slug := unaccent(slug);
  slug := translate(slug, '@', '-');
  slug := translate(slug, '.', '-');
  slug := translate(slug, ',', '-');
  slug := translate(slug, '_', '-');
  slug := translate(slug, '/', '-');
  slug := translate(slug, '&', 'and');
  slug := translate(slug, '''', '');
  slug := translate(slug, '"', '');
  slug := regexp_replace(slug, '[^a-z0-9-]', '', 'g'); -- Remove any character that is not alphanumeric or a hyphen
  return slug;
end;
$$ language plpgsql;

-- Drop and create the tg__assets_folder__generate_slug function
create or replace function priv.tg__assets_folder__generate_slug() returns trigger as $$
begin
  new.slug := priv.generate_slug(new.name);

  while exists(select 1 from publ.asset_folders where slug = new.slug) loop
    new.slug := new.slug || (floor(random() * 8999) + 1000)::text;
  end loop;

  return new;
end;
$$ language plpgsql volatile security definer;

-- Drop and create the _200_generate_slug_trigger trigger for asset_folders
drop trigger if exists _200_generate_slug_trigger on publ.asset_folders;
create trigger _200_generate_slug_trigger
before insert on publ.asset_folders
for each row
execute procedure priv.tg__assets_folder__generate_slug();

-- Drop and create the tg__pages__generate_slug function
create or replace function priv.tg__pages__generate_slug() returns trigger as $$
begin
  new.slug := priv.generate_slug(new.title);

  while exists(select 1 from publ.pages where slug = new.slug) loop
    new.slug := new.slug || (floor(random() * 8999) + 1000)::text;
  end loop;

  return new;
end;
$$ language plpgsql volatile security definer;

-- Drop and create the _200_generate_slug_trigger trigger for pages
drop trigger if exists _200_generate_slug_trigger on publ.pages;
create trigger _200_generate_slug_trigger
before insert on publ.pages
for each row
execute procedure priv.tg__pages__generate_slug();

-- Drop and create the tg__blog_posts__generate_slug function
create or replace function priv.tg__blog_posts__generate_slug() returns trigger as $$
begin
  new.slug := priv.generate_slug(new.title);

  while exists(select 1 from publ.blog_posts where slug = new.slug) loop
    new.slug := new.slug || (floor(random() * 8999) + 1000)::text;
  end loop;

  return new;
end;
$$ language plpgsql volatile security definer;

-- Drop and create the _200_generate_slug_trigger trigger for blog_posts
drop trigger if exists _200_generate_slug_trigger on publ.blog_posts;
create trigger _200_generate_slug_trigger
before insert on publ.blog_posts
for each row
execute procedure priv.tg__blog_posts__generate_slug();