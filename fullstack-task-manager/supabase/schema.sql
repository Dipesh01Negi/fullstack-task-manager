create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title varchar(120) not null check (char_length(trim(title)) > 0),
  description text not null default '',
  due_date date,
  priority text not null default 'Medium' check (priority in ('Low', 'Medium', 'High')),
  category text not null default 'Personal' check (category in ('Work', 'Study', 'Personal', 'Urgent')),
  status text not null default 'Todo' check (status in ('Todo', 'In Progress', 'Done')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists tasks_user_id_created_at_idx on public.tasks (user_id, created_at desc);
create index if not exists tasks_user_id_due_date_idx on public.tasks (user_id, due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute procedure public.set_updated_at();

alter table public.tasks enable row level security;

drop policy if exists "Users can view their own tasks" on public.tasks;
create policy "Users can view their own tasks"
on public.tasks for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own tasks" on public.tasks;
create policy "Users can create their own tasks"
on public.tasks for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own tasks" on public.tasks;
create policy "Users can update their own tasks"
on public.tasks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own tasks" on public.tasks;
create policy "Users can delete their own tasks"
on public.tasks for delete
using (auth.uid() = user_id);

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;
