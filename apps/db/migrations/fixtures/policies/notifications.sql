-- select and insert self

create policy select_notifications
on publ.notifications
for select
using (true);

create policy update_notifications
on publ.notifications
for update
using (true)
with check ((select is_admin from publ.users where id = publ.current_user_id()) = true);

create policy delete_notifications
on publ.notifications
for delete
using ((select is_admin from publ.users where id = publ.current_user_id()) = true);

create policy insert_notifications
on publ.notifications
for insert
with check ((select is_admin from publ.users where id = publ.current_user_id()) = true);