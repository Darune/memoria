import {
  createTRPCProxyClient,
  httpBatchLink,
  loggerLink,
} from '@trpc/client';
import type { AppRouter } from "./trpc-router";


export const client = createTRPCProxyClient<AppRouter>({
  links: [loggerLink(), httpBatchLink({ url: "/api/trpc" })],
});