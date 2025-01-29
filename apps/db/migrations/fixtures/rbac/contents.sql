grant select on publ.contents to :DATABASE_VISITOR;
grant insert(title, type, duration_in_seconds, is_a_tool, image_id) on publ.contents to :DATABASE_VISITOR;
grant update(title, duration_in_seconds, is_a_tool, image_id) on publ.contents to :DATABASE_VISITOR;

grant select on publ.articles to :DATABASE_VISITOR;
grant insert(id, body) on publ.articles to :DATABASE_VISITOR;
grant update(body) on publ.articles to :DATABASE_VISITOR;

grant select on publ.podcasts to :DATABASE_VISITOR;
grant insert(id, podcast_id, transcript) on publ.podcasts to :DATABASE_VISITOR;
grant update(podcast_id, transcript) on publ.podcasts to :DATABASE_VISITOR;

grant select on publ.videos to :DATABASE_VISITOR;
grant insert(id, vimeo_id, transcript) on publ.videos to :DATABASE_VISITOR;
grant update(vimeo_id, transcript) on publ.videos to :DATABASE_VISITOR;