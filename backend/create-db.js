import { Client } from 'pg';

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '@Por951357',
  database: 'postgres' // Connect to default database
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('Conectado ao PostgreSQL');
    
    // Drop database if it exists
    await client.query('DROP DATABASE IF EXISTS finance_system;');
    console.log('✓ Database anterior removida');
    
    // Create database
    await client.query('CREATE DATABASE finance_system;');
    console.log('✓ Database finance_system criada');
    
    await client.end();
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createDatabase();
