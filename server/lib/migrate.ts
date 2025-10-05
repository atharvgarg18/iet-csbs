import { supabaseAdmin } from './supabase.js';
import fs from 'fs';
import path from 'path';

export async function runMigration() {
  try {
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_cms_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      return false;
    }
    
    console.log('Migration completed successfully!');
    return true;
  } catch (error) {
    console.error('Error running migration:', error);
    return false;
  }
}