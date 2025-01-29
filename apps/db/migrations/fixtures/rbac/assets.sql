revoke all on table publ.asset_folders from :DATABASE_VISITOR;
revoke all on table publ.assets from :DATABASE_VISITOR;
-- asset_folders
grant select on publ.asset_folders to :DATABASE_VISITOR;
grant insert (name, parent_id) on publ.asset_folders to :DATABASE_VISITOR;
grant update (name, parent_id) on publ.asset_folders to :DATABASE_VISITOR;
grant delete on publ.asset_folders to :DATABASE_VISITOR;
-- assets
grant select on publ.assets to :DATABASE_VISITOR;
grant insert (name, url, key, mime_type, size, formats, height, width, alt, caption, asset_folder_id) on publ.assets to :DATABASE_VISITOR;
grant update (name, url, key, mime_type, size, formats, height, width, alt, caption, asset_folder_id) on publ.assets to :DATABASE_VISITOR;
grant delete on publ.assets to :DATABASE_VISITOR;