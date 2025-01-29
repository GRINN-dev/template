-- Users are publicly visible.
create policy select_all on publ.users for select using (true);
-- You can only update yourself.
create policy update_self on publ.users for update using (id = publ.current_user_id());