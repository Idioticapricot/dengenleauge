# **Supabase Setup for DengenLeague**

## **Step 1: Create Supabase Project**

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up/Login with GitHub
4. Click "New Project"
5. Choose organization
6. Fill project details:
   - **Name**: `dengenleague`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
7. Click "Create new project"
8. Wait 2-3 minutes for setup

## **Step 2: Get Supabase Credentials**

1. In your Supabase dashboard, go to **Settings > API**
2. Copy these values:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-ref].supabase.co"

# Anon Key (public)
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Service Role Key (secret)
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

3. Go to **Settings > Database**
4. Copy the connection string:

```bash
# Connection pooling (recommended)
DATABASE_URL="postgresql://postgres.xxx:[password]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

# Direct connection
DIRECT_URL="postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres"
```

## **Step 3: Update Environment Variables**

Replace placeholders in your `.env` file:

```bash
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Algorand Configuration (keep existing)
ALGORAND_NODE_URL="https://testnet-api.algonode.cloud"
ALGORAND_INDEXER_URL="https://testnet-idx.algonode.cloud"
DEGEN_ASSET_ID=""
CREATOR_MNEMONIC=""

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_NETWORK="testnet"
```

## **Step 4: Initialize Database Schema**

```bash
# Push Prisma schema to Supabase
npx prisma db push

# Generate Prisma client
npx prisma generate

# Optional: View database
npx prisma studio
```

## **Step 5: Verify Supabase Connection**

1. In Supabase dashboard, go to **Table Editor**
2. You should see all tables created:
   - User
   - MemeTeam
   - MemeBattle
   - FavoriteCoin
   - TeamPreset
   - MultiplayerBattle
   - MatchmakingQueue
   - BattleRoom

## **Step 6: Test the Application**

```bash
# Start development server
npm run dev

# Test database connection
# Go to http://localhost:3000/team
# Connect wallet and create user
# Check Supabase Table Editor for new user record
```

## **Step 7: Enable Row Level Security (Optional)**

For production security:

1. In Supabase dashboard, go to **Authentication > Policies**
2. Enable RLS on tables
3. Create policies for user access

Example policy for User table:
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON "User"
FOR SELECT USING (auth.uid()::text = id);
```

## **Supabase Features Available**

### **Real-time Subscriptions**
```typescript
// Listen to battle updates
supabase
  .channel('battles')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'MultiplayerBattle' },
    (payload) => console.log('New battle:', payload)
  )
  .subscribe()
```

### **Authentication (Future)**
```typescript
// User signup/login
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

### **Storage (Future)**
```typescript
// Upload battle replays, NFT images
const { data, error } = await supabase.storage
  .from('battle-replays')
  .upload('replay.json', file)
```

## **Troubleshooting**

### **Connection Issues**
- Verify DATABASE_URL format is correct
- Check password doesn't contain special characters
- Ensure project is not paused (free tier limitation)

### **Schema Issues**
```bash
# Reset database if needed
npx prisma migrate reset
npx prisma db push
```

### **Permission Issues**
- Verify SUPABASE_SERVICE_ROLE_KEY is correct
- Check RLS policies if enabled

## **Supabase Dashboard URLs**

- **Project Dashboard**: https://supabase.com/dashboard/project/[project-ref]
- **Table Editor**: https://supabase.com/dashboard/project/[project-ref]/editor
- **SQL Editor**: https://supabase.com/dashboard/project/[project-ref]/sql
- **API Docs**: https://supabase.com/dashboard/project/[project-ref]/api

**✅ Supabase is now configured for DengenLeague!**

Your database is hosted on Supabase with:
- ✅ PostgreSQL database
- ✅ Connection pooling
- ✅ Real-time capabilities
- ✅ Built-in authentication (ready for future use)
- ✅ File storage (ready for future use)
- ✅ Automatic backups