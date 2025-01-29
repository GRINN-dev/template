-- user super admin
delete from publ.users where id = '05d30a6c-2b47-452c-bc52-c62da6d9f150';
insert into publ.users (id, firstname, lastname, email) values
  (
    '05d30a6c-2b47-452c-bc52-c62da6d9f150',
    'Super',
    'Admin',
    'superadmin@grinn.tech'
  );
update priv.user_secrets set password_hash = crypt('password', gen_salt('bf')) where user_id = '05d30a6c-2b47-452c-bc52-c62da6d9f150';

-- user super admin 2
delete from publ.users where id = '05d30a6c-2b47-452c-bc52-c62da6d9f151';
insert into publ.users (id, firstname, lastname, email) values
  (
    '05d30a6c-2b47-452c-bc52-c62da6d9f151',
    'Super',
    'Admin 2',
    'superadmin2@grinn.tech'
  );
update priv.user_secrets set password_hash = crypt('password', gen_salt('bf')) where user_id = '05d30a6c-2b47-452c-bc52-c62da6d9f151';