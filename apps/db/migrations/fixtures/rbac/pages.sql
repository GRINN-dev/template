revoke all on table publ.pages from :DATABASE_VISITOR;

grant select on publ.pages to :DATABASE_VISITOR;
grant insert (status, title, content) on publ.pages to :DATABASE_VISITOR;
grant update (status, title, content) on publ.pages to :DATABASE_VISITOR;
grant delete on publ.pages to :DATABASE_VISITOR;