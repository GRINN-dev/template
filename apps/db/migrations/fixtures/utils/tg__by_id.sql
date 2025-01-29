create function priv.tg__by_id() returns trigger as $$
begin
  NEW.created_by_id = (
    case when TG_OP = 'INSERT' then publ.current_user_id()
    else OLD.created_by_id
    end
  );
  NEW.last_updated_by_id = (
    case when TG_OP = 'INSERT' then publ.current_user_id()
    else publ.current_user_id()
    end
  );
  return NEW;
end;
$$ language plpgsql volatile set search_path to pg_catalog, public, pg_temp;
