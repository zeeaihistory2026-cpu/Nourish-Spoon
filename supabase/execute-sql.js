const fs = require('fs');
const path = require('path');

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectRef = process.env.SUPABASE_PROJECT_REF || 'pxcoixwchnfzwnricktu';

if (!token) {
  console.error('❌ Please provide SUPABASE_ACCESS_TOKEN environment variable');
  console.error('Usage: SUPABASE_ACCESS_TOKEN=your_token node supabase/execute-sql.js');
  process.exit(1);
}

async function runQuery(sql, label) {
  console.log(`\n⏳ Running: ${label}...`);
  const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  const resText = await response.text();
  let data;
  try {
    data = JSON.parse(resText);
  } catch (e) {
    data = resText;
  }

  if (!response.ok) {
    console.error(`❌ Error in ${label}:`, resText);
    throw new Error(`Failed to execute ${label}`);
  }

  console.log(`✅ Success: ${label}`);
  return data;
}

async function main() {
  try {
    console.log('🚀 Connecting to Supabase Project:', projectRef);

    // 1. Initial Schema
    const schemaSql = fs.readFileSync(path.join(__dirname, 'migrations', '001_initial_schema.sql'), 'utf8');
    await runQuery(schemaSql, 'Migration 001 - Initial Schema');

    // 2. RLS Policies
    const rlsSql = fs.readFileSync(path.join(__dirname, 'migrations', '002_rls_policies.sql'), 'utf8');
    await runQuery(rlsSql, 'Migration 002 - RLS Policies');

    // 3. Storage Buckets
    const storageSql = fs.readFileSync(path.join(__dirname, 'migrations', '003_storage_buckets.sql'), 'utf8');
    await runQuery(storageSql, 'Migration 003 - Storage Buckets');

    // 4. Seed Data
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed', 'seed.sql'), 'utf8');
    await runQuery(seedSql, 'Seed Data (Products, Variants, Ingredients, Orders, Reviews, FAQs)');

    // 5. Verification Check
    const verifySql = `
      SELECT 
        table_name,
        (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
      FROM (
        SELECT 
          table_name,
          query_to_xml(format('select count(*) as cnt from %I', table_name), false, true, '') as xml_count
        FROM information_schema.tables
        WHERE table_schema = 'public'
      ) t
      ORDER BY table_name;
    `;
    const tables = await runQuery(verifySql, 'Verification Table Counts');
    console.log('\n📊 Database Tables Verified:');
    console.table(tables);

  } catch (error) {
    console.error('Fatal error applying database setup:', error);
    process.exit(1);
  }
}

main();
