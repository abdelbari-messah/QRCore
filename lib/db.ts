import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

function createDbClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to your environment variables.",
    );
  }

  const pool = global.pgPool ?? new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  const client =
    global.prisma ??
    new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    global.prisma = client;
    global.pgPool = pool;
  }

  return client;
}

export function getDb(): PrismaClient {
  return createDbClient();
}
