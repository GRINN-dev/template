revoke all on table publ.authors from :DATABASE_VISITOR;
revoke all on table publ.blog_posts from :DATABASE_VISITOR;

-- authors
grant select on publ.authors to :DATABASE_VISITOR;
grant insert (name, avatar_id, title) on publ.authors to :DATABASE_VISITOR;
grant update (name, avatar_id, title) on publ.authors to :DATABASE_VISITOR;
grant delete on publ.authors to :DATABASE_VISITOR;
-- blog_posts
grant select on publ.blog_posts to :DATABASE_VISITOR;
grant insert (title, content, status, author_id, published_at) on publ.blog_posts to :DATABASE_VISITOR;
grant update (title, content, status, author_id, published_at) on publ.blog_posts to :DATABASE_VISITOR;
grant delete on publ.blog_posts to :DATABASE_VISITOR;
