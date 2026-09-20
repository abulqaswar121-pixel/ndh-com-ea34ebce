-- Agreed fees on tasks + automatic earnings flow
alter table public.tasks add column if not exists talent_fee numeric;
alter table public.tasks add column if not exists fee_credited boolean not null default false;
alter table public.tasks add column if not exists fee_released boolean not null default false;

-- Brief tagging so the right PMs get notified
alter table public.projects add column if not exists service_area text;
alter table public.profiles add column if not exists service_areas text[] not null default '{}';

-- 1) When a task with a fee is marked done, credit the assignee's pending balance
create or replace function public.credit_task_fee()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if new.status = 'done' and old.status is distinct from 'done'
     and new.assignee_id is not null and coalesce(new.talent_fee,0) > 0
     and not new.fee_credited then
    insert into public.talent_earnings (talent_id, currency, pending_amount, available_amount, paid_amount)
    values (new.assignee_id, 'NGN', new.talent_fee, 0, 0)
    on conflict (talent_id) do update
      set pending_amount = public.talent_earnings.pending_amount + new.talent_fee;
    new.fee_credited := true;
  end if;
  return new;
end $$;

drop trigger if exists tasks_credit_fee on public.tasks;
create trigger tasks_credit_fee before update on public.tasks
for each row execute function public.credit_task_fee();

-- 2) When the client accepts the project (status -> completed), pending becomes available
create or replace function public.release_project_fees()
returns trigger language plpgsql security definer set search_path to 'public' as $$
declare t record;
begin
  if new.status = 'completed' and old.status is distinct from 'completed' then
    for t in
      select id, assignee_id, talent_fee from public.tasks
      where project_id = new.id and status = 'done' and fee_credited
        and not fee_released and coalesce(talent_fee,0) > 0
    loop
      update public.talent_earnings
        set pending_amount = greatest(pending_amount - t.talent_fee, 0),
            available_amount = available_amount + t.talent_fee
        where talent_id = t.assignee_id;
      update public.tasks set fee_released = true where id = t.id;
    end loop;
  end if;
  return new;
end $$;

drop trigger if exists projects_release_fees on public.projects;
create trigger projects_release_fees before update on public.projects
for each row execute function public.release_project_fees();

-- 3) A payout can never exceed the talent's available balance
create or replace function public.guard_payout_request()
returns trigger language plpgsql security definer set search_path to 'public' as $$
declare avail numeric;
begin
  select coalesce(available_amount,0) into avail from public.talent_earnings where talent_id = new.talent_id;
  if coalesce(new.amount,0) <= 0 or avail is null or new.amount > avail then
    raise exception 'Payout exceeds your available balance.';
  end if;
  return new;
end $$;

drop trigger if exists payout_guard on public.payout_requests;
create trigger payout_guard before insert on public.payout_requests
for each row execute function public.guard_payout_request();

-- 4) When admin marks a payout paid, move available -> paid exactly once
create or replace function public.settle_payout()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if new.status = 'paid' and old.status is distinct from 'paid' then
    update public.talent_earnings
      set available_amount = greatest(available_amount - new.amount, 0),
          paid_amount = paid_amount + new.amount
      where talent_id = new.talent_id;
  end if;
  return new;
end $$;

drop trigger if exists payout_settle on public.payout_requests;
create trigger payout_settle before update on public.payout_requests
for each row execute function public.settle_payout();