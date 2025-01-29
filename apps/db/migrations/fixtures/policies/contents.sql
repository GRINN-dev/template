-- en attendant de définir les règles de sécurité on autorise tout le monde à tout faire

-- contents
create policy no_limit on publ.contents for all using (true) with check(true);
-- articles
create policy no_limit on publ.articles for all using (true) with check(true);
-- podcasts
create policy no_limit on publ.podcasts for all using (true) with check(true);
-- videos
create policy no_limit on publ.videos for all using (true) with check(true);