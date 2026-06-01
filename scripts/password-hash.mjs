import { scryptSync, randomBytes } from "crypto";

/** bcrypt-style prefix so Table Editor shows this is hashed, not plain text */
export function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, 64).toString("hex");
  return `$scrypt$${salt}$${hash}`;
}
