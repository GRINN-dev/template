-- en attendant de définir les règles de sécurité on autorise tout le monde à tout faire

-- countries
create policy no_limit on publ.countries for all using (true) with check(true);
-- regions
create policy no_limit on publ.regions for all using (true) with check(true);
-- districts
create policy no_limit on publ.districts for all using (true) with check(true);
-- cities
create policy no_limit on publ.cities for all using (true) with check(true);
-- addresses
create policy no_limit on publ.addresses for all using (true) with check(true);
