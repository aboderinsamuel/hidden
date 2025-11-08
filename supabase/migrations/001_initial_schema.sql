-- closedNote Database Schema
-- This migration sets up the complete database schema for closedNote
-- with Row Level Security (RLS) to ensure users can only access their own data

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table (synced with Supabase Auth)
create table if not exists public.users (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  display_name text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create prompts table
create table if not exists public.prompts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  content text not null,
  model text not null,
  collection text not null default 'uncategorized',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create tags table (many-to-many relationship with prompts)
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  prompt_id uuid references public.prompts(id) on delete cascade not null,
  tag text not null,
  created_at timestamptz default now() not null,
  unique(prompt_id, tag)
);

-- Create indexes for better query performance
create index if not exists prompts_user_id_idx on public.prompts(user_id);
create index if not exists prompts_collection_idx on public.prompts(collection);
create index if not exists prompts_model_idx on public.prompts(model);
create index if not exists prompts_created_at_idx on public.prompts(created_at desc);
create index if not exists tags_prompt_id_idx on public.tags(prompt_id);
create index if not exists tags_tag_idx on public.tags(tag);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.prompts enable row level security;
alter table public.tags enable row level security;

-- RLS Policies for users table
-- Users can only read their own profile
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

-- Users can insert their own profile (triggered on signup)
create policy "Users can insert their own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- RLS Policies for prompts table
-- Users can only view their own prompts
create policy "Users can view their own prompts"
  on public.prompts for select
  using (auth.uid() = user_id);

-- Users can create their own prompts
create policy "Users can create their own prompts"
  on public.prompts for insert
  with check (auth.uid() = user_id);

-- Users can update their own prompts
create policy "Users can update their own prompts"
  on public.prompts for update
  using (auth.uid() = user_id);

-- Users can delete their own prompts
create policy "Users can delete their own prompts"
  on public.prompts for delete
  using (auth.uid() = user_id);

-- RLS Policies for tags table
-- Users can only view tags for their own prompts
create policy "Users can view tags for their own prompts"
  on public.tags for select
  using (
    exists (
      select 1 from public.prompts
      where prompts.id = tags.prompt_id
      and prompts.user_id = auth.uid()
    )
  );

-- Users can create tags for their own prompts
create policy "Users can create tags for their own prompts"
  on public.tags for insert
  with check (
    exists (
      select 1 from public.prompts
      where prompts.id = tags.prompt_id
      and prompts.user_id = auth.uid()
    )
  );

-- Users can delete tags for their own prompts
create policy "Users can delete tags for their own prompts"
  on public.tags for delete
  using (
    exists (
      select 1 from public.prompts
      where prompts.id = tags.prompt_id
      and prompts.user_id = auth.uid()
    )
  );

-- Function to handle user creation (trigger on auth.users)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create user profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers to automatically update updated_at
drop trigger if exists handle_users_updated_at on public.users;
create trigger handle_users_updated_at
  before update on public.users
  for each row execute function public.handle_updated_at();

drop trigger if exists handle_prompts_updated_at on public.prompts;
create trigger handle_prompts_updated_at
  before update on public.prompts
  for each row execute function public.handle_updated_at();
