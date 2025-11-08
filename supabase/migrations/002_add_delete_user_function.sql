-- Add function to safely delete a user account and all associated data
-- This function must run with SECURITY DEFINER to access auth.users

create or replace function public.delete_user()
returns void as $$
declare
  user_id uuid;
begin
  -- Get the current user's ID
  user_id := auth.uid();
  
  if user_id is null then
    raise exception 'Not authenticated';
  end if;

  -- Delete from auth.users (cascade will handle public.users, prompts, and tags)
  delete from auth.users where id = user_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to authenticated users
grant execute on function public.delete_user() to authenticated;
