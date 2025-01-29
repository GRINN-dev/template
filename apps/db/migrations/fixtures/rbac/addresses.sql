revoke all on table publ.countries from :DATABASE_VISITOR;
revoke all on table publ.regions from :DATABASE_VISITOR;
revoke all on table publ.districts from :DATABASE_VISITOR;
revoke all on table publ.cities from :DATABASE_VISITOR;
revoke all on table publ.addresses from :DATABASE_VISITOR;
-- countries
grant select on publ.countries to :DATABASE_VISITOR;
grant insert (name) on publ.countries to :DATABASE_VISITOR;
grant update (name) on publ.countries to :DATABASE_VISITOR;
grant delete on publ.countries to :DATABASE_VISITOR;
-- regions
grant select on publ.regions to :DATABASE_VISITOR;
grant insert (name, country_id) on publ.regions to :DATABASE_VISITOR;
grant update (name, country_id) on publ.regions to :DATABASE_VISITOR;
grant delete on publ.regions to :DATABASE_VISITOR;
-- districts
grant select on publ.districts to :DATABASE_VISITOR;
grant insert (name, zip_code, region_id) on publ.districts to :DATABASE_VISITOR;
grant update (name, zip_code, region_id) on publ.districts to :DATABASE_VISITOR;
grant delete on publ.districts to :DATABASE_VISITOR;
-- cities
grant select on publ.cities to :DATABASE_VISITOR;
grant insert (name, zip_code, latitude, longitude, district_id) on publ.cities to :DATABASE_VISITOR;
grant update (name, zip_code, latitude, longitude, district_id) on publ.cities to :DATABASE_VISITOR;
grant delete on publ.cities to :DATABASE_VISITOR;
-- addresses
grant select on publ.addresses to :DATABASE_VISITOR;
grant insert (first_line, second_line, zip_code, latitude, longitude, city_id, formatted_address) on publ.addresses to :DATABASE_VISITOR;
grant update (first_line, second_line, zip_code, latitude, longitude, city_id, formatted_address) on publ.addresses to :DATABASE_VISITOR;
grant delete on publ.addresses to :DATABASE_VISITOR;