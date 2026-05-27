alter table public.orders
  add column if not exists payment_provider text not null default 'robokassa';

alter table public.orders
  add column if not exists provider_payment_id text;

create index if not exists orders_provider on public.orders(payment_provider);
