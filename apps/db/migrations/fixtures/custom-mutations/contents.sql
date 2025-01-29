create or replace function publ.create_article(
    title text,
    duration_in_seconds int,
    is_a_tool bool,
    image_id uuid,
    body jsonb
) returns publ.articles as $$
declare
    v_content_id uuid;
    v_article publ.articles;
begin

    insert into publ.contents (title, type, duration_in_seconds, is_a_tool, image_id)
    values (title, 'ARTICLE', duration_in_seconds, is_a_tool, image_id)
    returning id into v_content_id;

    insert into publ.articles (id, body)
    values (v_content_id, body)
    returning * into v_article;

    return v_article;
    
end;
$$ language plpgsql volatile;
grant execute on function publ.create_article to :DATABASE_VISITOR;


create or replace function publ.create_podcast(
    title text,
    duration_in_seconds int,
    is_a_tool bool,
    image_id uuid,
    podcast_id uuid,
    transcript text
) returns publ.podcasts as $$
declare
    v_content_id uuid;
    v_podcast publ.podcasts;
begin

    insert into publ.contents (title, type, duration_in_seconds, is_a_tool, image_id)
    values (title, 'PODCAST', duration_in_seconds, is_a_tool, image_id)
    returning id into v_content_id;

    insert into publ.podcasts (id, podcast_id, transcript)
    values (v_content_id, podcast_id, transcript)
    returning * into v_podcast;

    return v_podcast;
    
end;
$$ language plpgsql volatile;
grant execute on function publ.create_podcast to :DATABASE_VISITOR;


create or replace function publ.create_video(
    title text,
    duration_in_seconds int,
    is_a_tool bool,
    image_id uuid,
    vimeo_id text,
    transcript text
) returns publ
.videos as $$
declare
    v_content_id uuid;
    v_video publ.videos;
begin

    insert into publ.contents (title, type, duration_in_seconds, is_a_tool, image_id)
    values (title, 'VIDEO', duration_in_seconds, is_a_tool, image_id)
    returning id into v_content_id;

    insert into publ.videos (id, vimeo_id, transcript)
    values (v_content_id, vimeo_id, transcript)
    returning * into v_video;

    return v_video;
    
end;
$$ language plpgsql volatile;
grant execute on function publ.create_video to :DATABASE_VISITOR;