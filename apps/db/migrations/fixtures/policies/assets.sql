-- en attendant de définir les règles de sécurité on autorise tout le monde à tout faire
create policy no_limit on publ.asset_folders for all using (true) with check(true);

create policy no_limit on publ.assets for all using (true) with check(true);