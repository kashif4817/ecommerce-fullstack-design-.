-- Admin PIN setup for Supabase
-- Run this in the Supabase SQL Editor.

create table if not exists public.admin_access_pins (
  id bigint generated always as identity primary key,
  label text not null default 'Primary admin PIN',
  pin_code varchar(4) not null check (pin_code ~ '^[0-9]{4}$'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists admin_access_pins_one_active_idx
on public.admin_access_pins ((1))
where is_active = true;

alter table public.admin_access_pins enable row level security;

create or replace function public.verify_admin_pin(pin_input text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  matched boolean;
begin
  select exists (
    select 1
    from public.admin_access_pins
    where is_active = true
      and pin_code = trim(pin_input)
    limit 1
  )
  into matched;

  return coalesce(matched, false);
end;
$$;

revoke all on public.admin_access_pins from anon, authenticated;
grant execute on function public.verify_admin_pin(text) to anon, authenticated;

-- Insert your first PIN
insert into public.admin_access_pins (label, pin_code, is_active)
values ('Primary admin PIN', '1234', true);

-- Optional: rotate the PIN later
-- update public.admin_access_pins set is_active = false where is_active = true;
-- insert into public.admin_access_pins (label, pin_code, is_active)
-- values ('Primary admin PIN', '5678', true);
