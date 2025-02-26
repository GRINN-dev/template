-- select and insert self
create policy select_self
    on publ.notification_templates
    for select
    using (true);