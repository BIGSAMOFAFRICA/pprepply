// Prisma configuration exported as plain object to avoid internals import errors

const config = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:BIGSAM%40200five@db.bcuylzpweeixposckyom.supabase.co:5432/postgres",
    },
  },
};

export default config;
