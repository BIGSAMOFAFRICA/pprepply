import { defineConfig } from "@prisma/internals";

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:BIGSAM%40200five@db.bcuylzpweeixposckyom.supabase.co:5432/postgres",
    },
  },
});
