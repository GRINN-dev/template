-- en attendant de définir les règles de sécurité on autorise tout le monde à tout faire
create policy no_limit on publ.pages for all using (true) with check(true);