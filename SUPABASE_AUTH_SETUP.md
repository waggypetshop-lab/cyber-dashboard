# Supabase Authentication Setup Guide

## 1. Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add user_id column to focus_history table
ALTER TABLE focus_history 
ADD COLUMN user_id uuid REFERENCES auth.users(id);

-- Make user_id required for new entries (optional, but recommended)
-- ALTER TABLE focus_history ALTER COLUMN user_id SET NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE focus_history ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own focus history
CREATE POLICY "Users can view their own focus history" 
ON focus_history FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy: Users can insert their own focus entries
CREATE POLICY "Users can insert their own focus history" 
ON focus_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own focus entries
CREATE POLICY "Users can update their own focus history" 
ON focus_history FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy: Users can delete their own focus entries
CREATE POLICY "Users can delete their own focus history" 
ON focus_history FOR DELETE 
USING (auth.uid() = user_id);
```

## 2. Enable Email Auth in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Make sure **Email** is enabled
4. Configure email templates if desired (optional)

## 3. How Authentication Works

### Sign Up Flow:
1. User enters email and password
2. Supabase sends confirmation email
3. User clicks confirmation link
4. User can now sign in

### Sign In Flow:
1. User enters email and password
2. App checks authentication
3. If valid, shows dashboard
4. All data is filtered by user_id

### Data Isolation:
- Each user only sees their own focus history
- Row Level Security (RLS) enforces this at the database level
- user_id is automatically included in all INSERT operations

## 4. Testing

### Create Test Account:
1. Run the app
2. Click "Don't have an account? Sign Up"
3. Enter email and password (min 6 characters)
4. Check email for confirmation link
5. Click link, then sign in

### Test Data Isolation:
1. Sign in as User A, create some focus entries
2. Sign out
3. Sign in as User B, create different focus entries
4. Verify User B cannot see User A's data

## 5. Optional: Disable Email Confirmation

If you want to test without email confirmation:

1. Go to Supabase Dashboard > **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. Disable "Enable email confirmations"
4. Users can sign in immediately after sign up

## 6. Production Checklist

Before deploying to production:

- [ ] Configure custom email templates
- [ ] Set up custom SMTP provider (optional)
- [ ] Enable email confirmations
- [ ] Add password reset functionality
- [ ] Configure redirect URLs
- [ ] Test all authentication flows
- [ ] Verify RLS policies are working

