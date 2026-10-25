import { currentAccount, prototypeConfig, safeAccount } from "../../utils/auth";

export default defineEventHandler((event) => {
  const { ready } = prototypeConfig(event);
  const account = ready ? currentAccount(event) : null;
  return { ready, user: account ? safeAccount(account) : null };
});
