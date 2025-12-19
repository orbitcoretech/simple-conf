import bcrypt from 'bcrypt';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { users, folders, departmentEnum } from './schema/index';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://simpleconf:simpleconf@localhost:5432/simpleconf';

async function seed() {
  console.log('Starting database seeding...');

  const client = postgres(DATABASE_URL);
  const db = drizzle(client);

  try {
    // Hash password for admin user
    const passwordHash = await bcrypt.hash('admin123', 10);

    // Create admin user
    console.log('Creating admin user...');
    const [adminUser] = await db
      .insert(users)
      .values({
        email: 'admin@simpleconf.local',
        passwordHash,
        displayName: 'Admin User',
        department: 'backend',
      })
      .returning();

    console.log(`Created admin user: ${adminUser.email}`);

    // Create department folders
    const departments: (typeof departmentEnum.enumValues)[number][] = [
      'frontend',
      'backend',
      'sales',
      'hr',
      'product',
    ];

    const departmentDisplayNames: Record<string, string> = {
      frontend: 'Frontend',
      backend: 'Backend',
      sales: 'Sales',
      hr: 'HR',
      product: 'Product',
    };

    console.log('Creating department folders...');
    for (const dept of departments) {
      const [folder] = await db
        .insert(folders)
        .values({
          name: departmentDisplayNames[dept],
          parentId: null,
          department: dept,
          visibility: 'department',
          createdBy: adminUser.id,
        })
        .returning();

      console.log(`Created folder: ${folder.name}`);
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
