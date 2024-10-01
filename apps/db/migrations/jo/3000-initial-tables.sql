create extension if not exists "uuid-ossp" with schema extensions;

drop table if exists publ.genres cascade;
create table publ.genres (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  icon text,
  color text
);

grant select on publ.genres to :DATABASE_VISITOR;

-- insert into publ.genres(name, description, icon, color) values
--   ('Science Fiction', 'Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.', '👽', '#FFD700'),
--   ('Fantasy', 'Fantasy is a genre of speculative fiction set in a fictional universe, often inspired by real world myth and folklore.', '🧙', '#800080'),
--   ('Mystery', 'Mystery fiction is a genre of fiction usually involving a mysterious death or a crime to be solved.', '🕵️', '#0000FF'),
--   ('Thriller', 'Thriller is a genre of fiction that is peaking in popularity and is the most exciting, suspenseful genre in the literary world.', '🔪', '#FF0000'),
--   ('Romance', 'Romance novels are emotion-driven stories that are primarily focused on the relationship between the main characters of the story.', '💖', '#FF69B4'),
--   ('Horror', 'Horror is a genre of speculative fiction which is intended to frighten, scare, or disgust.', '👻', '#000000'),
--   ('Historical', 'Historical fiction is a literary genre in which the plot takes place in a setting located in the past.', '🏰', '#8B4513'),
--   ('Non-Fiction', 'Non-fiction is a genre of informational prose that communicates information and ideas that are factually accurate.', '📚', '#008000'),
--   ('Biography', 'A biography is a detailed description of a person''s life. It involves more than just the basic facts like education, work, relationships, and death; it portrays a person''s experience of these life events.', '👤', '#FFA500'),
--   ('Autobiography', 'An autobiography is a self-written account of the life of oneself.', '📖', '#FFA500'),
--   ('Poetry', 'Poetry is a form of literary art in which language is used for its aesthetic and evocative qualities in addition to, or in lieu of, its apparent meaning.', '📜', '#800000'),
--   ('Cookbook', 'A cookbook is a kitchen reference containing recipes and instructions on how to prepare and cook food.', '🍳', '#FF6347'); 

create index on publ.genres (name);

drop table if exists publ.authors cascade;
create table publ.authors (
  id uuid default uuid_generate_v4() primary key,
  firstname text not null,
  lastname text not null,
  birthdate date,
  birthplace text,
  deathdate date,
  deathplace text,
  biography text,
  picture text,
  referenced_by uuid references publ.users (id) on delete set null,
  referenced_at timestamp with time zone default now()
);

grant select on publ.authors to :DATABASE_VISITOR;

create index on publ.authors (firstname);
create index on publ.authors (lastname);
create index on publ.authors (birthdate);
create index on publ.authors (referenced_by);
create index on publ.authors (referenced_at);



drop table if exists publ.books cascade;
create table publ.books (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  cover_picture text,
  pages integer,
  isbn text,
  published_at date,
  author_id uuid references publ.authors (id) on delete set null,
  referenced_by uuid references publ.users (id) on delete set null,
    referenced_at timestamp with time zone default now()
);

grant select on publ.books to :DATABASE_VISITOR;

create index on publ.books (title);
create index on publ.books (isbn);
create index on publ.books (published_at);
create index on publ.books (author_id);
create index on publ.books (referenced_by);
create index on publ.books (referenced_at);

drop table if exists publ.book_genres cascade;
create table publ.book_genres (
  book_id uuid references publ.books (id) on delete cascade,
  genre_id uuid references publ.genres (id) on delete cascade,
  primary key (book_id, genre_id)
);

grant select on publ.book_genres to :DATABASE_VISITOR;

drop table if exists publ.book_authors cascade;
create table publ.book_authors (
  book_id uuid references publ.books (id) on delete cascade,
  author_id uuid references publ.authors (id) on delete cascade,
  primary key (book_id, author_id)
);

grant select on publ.book_authors to :DATABASE_VISITOR;

create index on publ.book_authors (book_id);

drop table if exists publ.users_books cascade;
create table publ.user_books (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references publ.users (id) on delete cascade,
  book_id uuid references publ.books (id) on delete cascade,
  is_favorite boolean default false,
  is_read boolean default false,
  condition text
);

grant select on publ.user_books to :DATABASE_VISITOR;

create index on publ.user_books (user_id);
create index on publ.user_books (book_id);
create index on publ.user_books (is_favorite);
create index on publ.user_books (is_read);

drop table if exists publ.book_reviews cascade;
create table publ.book_reviews (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references publ.books (id) on delete cascade,
  user_id uuid references publ.users (id) on delete cascade,
  rating integer,
  title text,
  review text,
  created_at timestamp with time zone default now()
);

grant select on publ.book_reviews to :DATABASE_VISITOR;

create index on publ.book_reviews (book_id);
create index on publ.book_reviews (user_id);
create index on publ.book_reviews (rating);
create index on publ.book_reviews (created_at);

drop table if exists book_clubs cascade;
create table publ.book_clubs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  picture text,
  created_at timestamp with time zone default now(),
  created_by uuid references publ.users (id) on delete set null
);

grant select on publ.book_clubs to :DATABASE_VISITOR;

create index on publ.book_clubs (name);
create index on publ.book_clubs (created_at);
create index on publ.book_clubs (created_by);


drop table if exists book_club_members cascade;
create table publ.book_club_members (
  book_club_id uuid references publ.book_clubs (id) on delete cascade,
  user_id uuid references publ.users (id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key (book_club_id, user_id)
);

grant select on publ.book_club_members to :DATABASE_VISITOR;

drop table if exists book_club_books cascade;
create table publ.book_club_books (
  book_club_id uuid references publ.book_clubs (id) on delete cascade,
  book_id uuid references publ.books (id) on delete cascade,
  added_at timestamp with time zone default now(),
  added_by uuid references publ.users (id) on delete set null,
  primary key (book_club_id, book_id)
);

grant select on publ.book_club_books to :DATABASE_VISITOR;

create index on publ.book_club_books (added_at);
create index on publ.book_club_books (added_by);

drop table if exists book_loans cascade;
create table publ.book_loans (
  id uuid default uuid_generate_v4() primary key,
  book_id uuid references publ.books (id) on delete cascade,
  user_id uuid references publ.users (id) on delete cascade,
  loaned_at timestamp with time zone default now(),
  returned_at timestamp with time zone
);

grant select on publ.book_loans to :DATABASE_VISITOR;

create index on publ.book_loans (loaned_at);
create index on publ.book_loans (returned_at);
create index on publ.book_loans (book_id);
create index on publ.book_loans (user_id);


INSERT INTO publ.genres (id, name, description, icon, color) VALUES
  (uuid_generate_v4(), 'Roman', 'Œuvres littéraires fictives', '📖', '#FF5733'),
  (uuid_generate_v4(), 'Science-Fiction', 'Exploration de mondes et de technologies futures', '🚀', '#33C3FF'),
  (uuid_generate_v4(), 'Histoire', 'Ouvrages relatant des événements historiques', '🏰', '#33FF57'),
  (uuid_generate_v4(), 'Biographie', 'Récits sur la vie de personnes célèbres', '🧑‍🦳', '#FF33A6');


INSERT INTO publ.authors (id, firstname, lastname, birthdate, birthplace, deathdate, deathplace, biography, picture, referenced_by, referenced_at) VALUES
  (uuid_generate_v4(), 'Victor', 'Hugo', '1802-02-26', 'Besançon, France', '1885-05-22', 'Paris, France', 'Écrivain et poète français, auteur des "Misérables" et "Notre-Dame de Paris"', 'victor_hugo.jpg', NULL, NOW()),
  (uuid_generate_v4(), 'Jules', 'Verne', '1828-02-08', 'Nantes, France', '1905-03-24', 'Amiens, France', 'Écrivain visionnaire de la science-fiction, auteur de "Vingt mille lieues sous les mers"', 'jules_verne.jpg', NULL, NOW()),
  (uuid_generate_v4(), 'Simone', 'de Beauvoir', '1908-01-09', 'Paris, France', '1986-04-14', 'Paris, France', 'Philosophe et auteure du mouvement féministe, notamment connue pour "Le Deuxième Sexe"', 'simone_de_beauvoir.jpg', NULL, NOW());

INSERT INTO publ.books (id, title, description, cover_picture, pages, isbn, published_at, author_id, referenced_by, referenced_at) VALUES
  (uuid_generate_v4(), 'Les Misérables', 'Roman historique et social sur la misère et la rédemption dans la France du XIXe siècle', 'les_miserables.jpg', 1232, '9782070409181', '1862-04-03', (SELECT id FROM publ.authors WHERE lastname = 'Hugo' LIMIT 1), NULL, NOW()),
  (uuid_generate_v4(), 'Vingt mille lieues sous les mers', 'Aventures sous-marines à bord du Nautilus avec le capitaine Nemo', '20000_lieues.jpg', 432, '9782070105822', '1870-06-20', (SELECT id FROM publ.authors WHERE lastname = 'Verne' LIMIT 1), NULL, NOW()),
  (uuid_generate_v4(), 'Le Deuxième Sexe', 'Essai fondateur du féminisme moderne analysant la condition des femmes', 'le_deuxieme_sexe.jpg', 800, '9782070323929', '1949-06-01', (SELECT id FROM publ.authors WHERE lastname = 'de Beauvoir' LIMIT 1), NULL, NOW());

INSERT INTO publ.book_genres (book_id, genre_id) VALUES
  ((SELECT id FROM publ.books WHERE title = 'Les Misérables' LIMIT 1), (SELECT id FROM publ.genres WHERE name = 'Roman' LIMIT 1)),
  ((SELECT id FROM publ.books WHERE title = 'Vingt mille lieues sous les mers' LIMIT 1), (SELECT id FROM publ.genres WHERE name = 'Science-Fiction' LIMIT 1)),
  ((SELECT id FROM publ.books WHERE title = 'Le Deuxième Sexe' LIMIT 1), (SELECT id FROM publ.genres WHERE name = 'Biographie' LIMIT 1));

INSERT INTO publ.users (id, firstname, lastname) VALUES
  (uuid_generate_v4(), 'Marie',  'Dupont'),
  (uuid_generate_v4(), 'Jean',  'Martin');

INSERT INTO publ.book_reviews (id, book_id, user_id, rating, title, review, created_at) VALUES
  (uuid_generate_v4(), (SELECT id FROM publ.books WHERE title = 'Les Misérables' LIMIT 1), (SELECT id FROM publ.users WHERE firstname = 'Marie' LIMIT 1), 5, 'Chef-d''œuvre!', 'Un livre puissant sur l''injustice et la rédemption.', NOW()),
  (uuid_generate_v4(), (SELECT id FROM publ.books WHERE title = 'Vingt mille lieues sous les mers' LIMIT 1), (SELECT id FROM publ.users WHERE firstname = 'Jean' LIMIT 1), 4, 'Captivant', 'Des aventures fascinantes sous la mer, très visionnaire.', NOW());
