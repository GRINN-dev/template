-- en attendant de définir les règles de sécurité on autorise tout le monde à tout faire

-- authors
create policy no_limit on publ.authors for all using (true) with check(true);
-- blog_posts
create policy no_limit on publ.blog_posts for all using (true) with check(true);