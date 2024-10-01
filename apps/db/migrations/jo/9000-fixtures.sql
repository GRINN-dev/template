-- user super admin


-- user Louis
delete from publ.users where id = '05d30a6c-2b47-452c-bc52-c62da6d9f150';
insert into publ.users (id, firstname, lastname, avatar_url, is_verified, birthday, title) values
  (
    '05d30a6c-2b47-452c-bc52-c62da6d9f150',
    'Louis',
    'Lecointre',
    'https://thispersondoesnotexist.com/',
    true,
    '1994-01-01',
    'CTO'
  );
update priv.user_secrets set password_hash = crypt('password', gen_salt('bf')) where user_id = '05d30a6c-2b47-452c-bc52-c62da6d9f150';
insert into publ.user_emails (user_id, email, is_verified, is_primary) values
  (
    '05d30a6c-2b47-452c-bc52-c62da6d9f150',
    'louis@grinn.tech',
    true,
    true
  );

-- organizations


delete from publ.organizations where id = '80bdb4c2-6fee-488c-b0c2-d9e34317c1d2';

insert into publ.organizations (id, name) values ('80bdb4c2-6fee-488c-b0c2-d9e34317c1d2', 'Grinn');

delete from publ.organization_memberships where id = 'd6cb365f-6282-4c79-bc75-f5ad547c31b9';
insert into publ.organization_memberships (id, user_id, organization_id, role) values
  (
    'd6cb365f-6282-4c79-bc75-f5ad547c31b9',
    '05d30a6c-2b47-452c-bc52-c62da6d9f150',
    '80bdb4c2-6fee-488c-b0c2-d9e34317c1d2',
    'USER'
  );
