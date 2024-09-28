import { createJiti } from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./src/env/server.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
