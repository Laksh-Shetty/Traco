import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

// Manually load the .env file
//npm install dotenv
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
});