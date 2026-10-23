export type AuthFlowPurpose = "password-reset" | "invitation" | null;

export function useAuthFlow() {
  return useState<{ email: string; purpose: AuthFlowPurpose }>(
    "estate-auth-flow",
    () => ({ email: "", purpose: null }),
  );
}
