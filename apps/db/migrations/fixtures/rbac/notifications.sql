grant select on publ.notifications to :DATABASE_VISITOR;
grant insert (user_id, notification_template_id, title, body, picture, data, status, opened_at, expo_ticket_id) on publ.notifications to :DATABASE_VISITOR;
grant update (status, opened_at, expo_ticket_id) on publ.notifications to :DATABASE_VISITOR;
grant delete on publ.notifications to :DATABASE_VISITOR;