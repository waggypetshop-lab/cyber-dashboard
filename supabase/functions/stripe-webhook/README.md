# Stripe Webhook - Supabase Edge Function

This Edge Function handles Stripe webhook events to automatically upgrade users to premium when they complete a payment.

---

## 🚀 **Quick Start**

### **1. Deploy the Edge Function**

```bash
# Make sure you're in your project root directory
cd your-project

# Deploy the function
supabase functions deploy stripe-webhook --no-verify-jwt
```

**Important:** Use `--no-verify-jwt` because Stripe webhooks don't include a JWT token.

---

## 🔑 **2. Set Environment Variables**

You need to configure three secrets in Supabase:

```bash
# Set Stripe Secret Key
supabase secrets set STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# Set Stripe Webhook Signing Secret (get this from Stripe Dashboard)
supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_your_webhook_secret

# Set Supabase Service Role Key (find in Supabase Dashboard > Settings > API)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Your SUPABASE_URL is automatically available in Edge Functions
```

### **Where to Find These Keys:**

#### **Stripe Keys** (https://dashboard.stripe.com)
1. Go to **Developers** → **API Keys**
2. Copy **Secret key** (starts with `sk_test_` or `sk_live_`)

#### **Webhook Signing Secret** (Create after webhook setup - see Step 3)
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Click **Reveal** next to **Signing secret**
4. Copy the secret (starts with `whsec_`)

#### **Supabase Service Role Key** (https://app.supabase.com)
1. Go to your project **Settings** → **API**
2. Copy **service_role** key (under "Project API keys")
3. ⚠️ **Keep this secret!** Never expose in frontend code

---

## 🔗 **3. Configure Stripe Webhook**

### **Get Your Edge Function URL**

After deploying, your webhook URL will be:
```
https://[your-project-ref].supabase.co/functions/v1/stripe-webhook
```

Find your project ref in Supabase Dashboard → **Settings** → **API** → **Project URL**

### **Create Webhook in Stripe Dashboard**

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL**: Enter your Edge Function URL
4. **Events to send**: Select `checkout.session.completed`
5. Click **Add endpoint**
6. Copy the **Signing secret** and set it as environment variable (see Step 2)

---

## 🧪 **4. Test the Webhook**

### **Option A: Test in Development**

Use Stripe CLI to forward webhooks to your local Edge Function:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# or download from https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to your deployed Edge Function
stripe listen --forward-to https://[your-project-ref].supabase.co/functions/v1/stripe-webhook
```

### **Option B: Test with Real Payment**

1. Go to your app at http://localhost:5173 (or your deployed URL)
2. Click the **UPGRADE** button
3. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any billing ZIP
4. Complete the payment
5. Check your Supabase logs to see webhook processing

---

## 📊 **5. Monitor Webhook Events**

### **Supabase Logs**

```bash
# View real-time logs
supabase functions logs stripe-webhook --tail
```

### **Stripe Dashboard**

1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. View **Recent events** to see successful/failed attempts
4. Click on any event to see request/response details

---

## 🔍 **How It Works**

### **Payment Flow**

```
1. User clicks "UPGRADE" button
   ↓
2. Frontend opens Stripe Checkout
   URL: ...?client_reference_id={user_id}
   ↓
3. User completes payment
   ↓
4. Stripe sends webhook to Edge Function
   Event: checkout.session.completed
   ↓
5. Edge Function verifies signature
   ↓
6. Extracts client_reference_id (user ID)
   ↓
7. Updates Supabase: profiles.is_premium = true
   ↓
8. User refreshes → sees PRO badge ✨
```

### **Code Flow**

```typescript
1. Receive POST request from Stripe
2. Extract signature from headers
3. Verify signature with webhookSecret
4. Parse event type
5. If checkout.session.completed:
   - Get client_reference_id (user_id)
   - Create Supabase Admin Client
   - Update profiles table
   - Return 200 OK
6. If signature fails → Return 400
7. If other error → Return 500
```

---

## 🛡️ **Security Features**

✅ **Signature Verification** - Ensures webhook is from Stripe  
✅ **Service Role Key** - Bypasses RLS for admin operations  
✅ **Environment Variables** - Secrets never exposed in code  
✅ **No JWT Required** - Stripe doesn't send auth tokens  

---

## 🐛 **Troubleshooting**

### **Webhook Not Receiving Events**

**Check:**
1. Edge Function is deployed: `supabase functions list`
2. Webhook URL is correct in Stripe Dashboard
3. Webhook signing secret is set: `supabase secrets list`
4. Stripe is sending to the right endpoint

**View Logs:**
```bash
supabase functions logs stripe-webhook --tail
```

### **Signature Verification Fails**

**Issue:** `Webhook signature verification failed`

**Fix:**
1. Make sure `STRIPE_WEBHOOK_SIGNING_SECRET` is correct
2. It should start with `whsec_`
3. Get it from Stripe Dashboard → Webhooks → Your Endpoint → Reveal Secret

```bash
supabase secrets set STRIPE_WEBHOOK_SIGNING_SECRET=whsec_your_actual_secret
```

### **Database Update Fails**

**Issue:** `Failed to update profile`

**Check:**
1. User ID exists in `profiles` table
2. Service role key is correct
3. RLS policies allow service role to update

**Test Query:**
```sql
-- Check if user profile exists
SELECT * FROM profiles WHERE id = 'user-id-from-webhook';

-- Manually test update
UPDATE profiles SET is_premium = true WHERE id = 'user-id';
```

### **User Still Shows as Free**

**Fix:**
1. Check Supabase logs for errors
2. Verify profile was updated:
   ```sql
   SELECT id, is_premium FROM profiles WHERE id = 'user-id';
   ```
3. User might need to refresh the page
4. Check `useProfile` hook is fetching correctly

---

## 📝 **Environment Variables Summary**

| Variable | Where to Get It | Example |
|----------|----------------|---------|
| `STRIPE_SECRET_KEY` | Stripe Dashboard → API Keys | `sk_test_...` |
| `STRIPE_WEBHOOK_SIGNING_SECRET` | Stripe Dashboard → Webhooks → Your Endpoint | `whsec_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API | `eyJhbGc...` |
| `SUPABASE_URL` | Automatically available | `https://xxx.supabase.co` |

---

## 🎯 **Testing Checklist**

- [ ] Edge Function deployed successfully
- [ ] Environment variables configured
- [ ] Webhook endpoint created in Stripe
- [ ] Webhook signing secret set
- [ ] Test payment completed
- [ ] Webhook received and verified
- [ ] User profile updated to premium
- [ ] Frontend shows PRO badge

---

## 🔄 **Update Function**

After making code changes:

```bash
# Deploy updated function
supabase functions deploy stripe-webhook --no-verify-jwt

# Verify it's running
supabase functions logs stripe-webhook --tail

# Test with a payment
```

---

## 📚 **Additional Resources**

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)

---

## 🎉 **Success!**

When everything is working, you'll see:
- ✅ Stripe sends webhook
- ✅ Edge Function receives and verifies
- ✅ Database updated
- ✅ User sees PRO badge

Your payment system is now fully automated! 🚀

