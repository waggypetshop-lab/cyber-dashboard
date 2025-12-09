# User Profiles Setup Guide

This guide explains how to set up user profiles with subscription status in your Cyberpunk Dashboard.

## 📋 What This Does

- Creates a `profiles` table linked to Supabase Auth users
- Stores user subscription status (`is_premium` boolean)
- Automatically creates a profile when users sign up
- Enables Row Level Security (RLS) for data protection

---

## 🚀 Step 1: Apply the Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **"New query"**
5. Open the file `supabase_profiles_migration.sql`
6. Copy and paste the entire contents into the SQL Editor
7. Click **"Run"** to execute the migration

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

---

## ✅ Step 2: Verify the Migration

Run this query in the SQL Editor to verify the table was created:

```sql
SELECT * FROM public.profiles;
```

You should see the table structure with columns: `id`, `is_premium`, `created_at`, `updated_at`

---

## 🔍 Step 3: Test the Trigger

To test that profiles are automatically created:

1. Sign up a new user through your app
2. Run this query in SQL Editor:

```sql
SELECT 
  u.email,
  p.is_premium,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id;
```

You should see all users with their corresponding profiles.

---

## 💻 Step 4: Use in Your React App

### Basic Usage

```javascript
import { useProfile } from '../hooks/useProfile'

function MyComponent() {
  const { profile, loading, isPremium } = useProfile()

  if (loading) return <div>Loading...</div>

  return (
    <div>
      {isPremium ? (
        <div>⭐ Premium User</div>
      ) : (
        <div>Free User - Upgrade to Premium!</div>
      )}
    </div>
  )
}
```

### Advanced Usage

```javascript
import { useProfile } from '../hooks/useProfile'

function Dashboard() {
  const { profile, loading, error, refetch, isPremium } = useProfile()

  if (loading) return <div>Loading profile...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>User Profile</h2>
      <p>Status: {isPremium ? 'Premium ⭐' : 'Free'}</p>
      <p>Created: {new Date(profile.created_at).toLocaleDateString()}</p>
      
      <button onClick={refetch}>Refresh Profile</button>
    </div>
  )
}
```

---

## 🔧 Manually Update Subscription Status

To manually set a user as premium (useful for testing or admin actions):

```sql
-- Replace 'user-id-here' with actual user UUID
UPDATE public.profiles
SET is_premium = true
WHERE id = 'user-id-here';
```

To find a user's ID:

```sql
SELECT id, email FROM auth.users WHERE email = 'user@example.com';
```

---

## 🛡️ Row Level Security (RLS)

The migration enables RLS with these policies:

1. **Read**: Users can only view their own profile
2. **Update**: Users can only update their own profile
3. **Insert**: Handled automatically by the trigger

### Test RLS

Try accessing another user's profile - it should be blocked:

```javascript
// This will only return the current user's profile
const { data } = await supabase
  .from('profiles')
  .select('*')
  .single()
```

---

## 🎯 Next Steps

### Add More Profile Fields

You can extend the profiles table with additional fields:

```sql
ALTER TABLE public.profiles
ADD COLUMN display_name TEXT,
ADD COLUMN avatar_url TEXT,
ADD COLUMN bio TEXT;
```

### Create a Profile Update Function

Add this to your React app:

```javascript
export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}
```

### Add Premium Features

Example of checking premium status before allowing access:

```javascript
function PremiumFeature() {
  const { isPremium, loading } = useProfile()

  if (loading) return <div>Loading...</div>

  if (!isPremium) {
    return (
      <div className="border-2 border-neon-green/30 rounded-lg p-6 text-center">
        <h3 className="text-neon-green font-cyber mb-4">Premium Feature</h3>
        <p className="text-neon-green/70 mb-4">
          Upgrade to Premium to unlock this feature!
        </p>
        <button className="bg-neon-green text-cyber-dark px-6 py-2 rounded font-cyber">
          UPGRADE NOW
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Premium content here */}
      <h3>✨ Premium Feature Unlocked!</h3>
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### Profiles not being created automatically

1. Check if the trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

2. Verify the trigger function:
```sql
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
```

3. Re-run the trigger creation section of the migration

### RLS blocking legitimate access

1. Check current policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

2. Verify you're authenticated:
```javascript
const { data: { session } } = await supabase.auth.getSession()
console.log('Session:', session)
```

### Permission errors

Grant permissions again:
```sql
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
```

---

## 📚 Database Schema

```
public.profiles
├── id (UUID, PRIMARY KEY, FK -> auth.users.id)
├── is_premium (BOOLEAN, DEFAULT false)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

Relationships:
- profiles.id -> auth.users.id (ON DELETE CASCADE)

Triggers:
- on_auth_user_created (AFTER INSERT on auth.users)
- set_updated_at (BEFORE UPDATE on profiles)

Policies (RLS):
- Users can view their own profile
- Users can update their own profile
- Service role can insert profiles
```

---

## 🎉 Done!

Your user profiles system is now set up and ready to use! Users will automatically get a profile when they sign up, and you can track their subscription status throughout your app.

