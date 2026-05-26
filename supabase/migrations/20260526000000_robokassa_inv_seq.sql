create sequence if not exists public.robokassa_inv_seq start 1;

create or replace function public.next_inv_id()
returns bigint
language sql
security definer
set search_path = public
as $$
  select nextval('public.robokassa_inv_seq');
$$;

grant execute on function public.next_inv_id() to service_role;
