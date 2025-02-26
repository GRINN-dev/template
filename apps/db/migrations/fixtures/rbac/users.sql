revoke all on table publ.users from :DATABASE_VISITOR;

grant select on publ.users to :DATABASE_VISITOR;
grant insert (firstname, lastname, email) on publ.users to :DATABASE_VISITOR;
grant update (firstname, lastname, email, avatar_url, app_version, push_token) on publ.users to :DATABASE_VISITOR;
-- NOTE: `delete` is not granted, because we require confirmation via request_account_deletion/confirm_account_deletion