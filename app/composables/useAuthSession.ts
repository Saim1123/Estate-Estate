import type { PublicAccount } from "~/types/access";

export function useAuthSession() {
  const user = useState<PublicAccount | null>("estate-auth-user", () => null);
  return { user };
}
