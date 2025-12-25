-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone" on profiles for select using ( true );
create policy "Users can insert their own profile" on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile" on profiles for update using ( auth.uid() = id );

-- 2. People Table
create table public.people (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  username text not null,
  created_at timestamp with time zone default now(),
  unique(user_id, username)
);

alter table public.people enable row level security;

create policy "Users can view their own people" on people for select using ( auth.uid() = user_id );
create policy "Users can insert their own people" on people for insert with check ( auth.uid() = user_id );
create policy "Users can update their own people" on people for update using ( auth.uid() = user_id );
create policy "Users can delete their own people" on people for delete using ( auth.uid() = user_id );

-- 3. Transactions Table
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  person_id uuid references public.people(id) on delete cascade, -- Cascade delete when person is deleted
  type text check (type in ('lend', 'borrow', 'repayment', 'paid_back')) not null,
  amount numeric not null,
  person_username text,
  description text,
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions" on transactions for select using ( auth.uid() = user_id );
create policy "Users can insert their own transactions" on transactions for insert with check ( auth.uid() = user_id );
create policy "Users can update their own transactions" on transactions for update using ( auth.uid() = user_id );
create policy "Users can delete their own transactions" on transactions for delete using ( auth.uid() = user_id );
