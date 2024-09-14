// useCurrentRoute.ts
import { usePathname } from "expo-router";

export const useCurrentRoute = () => {
  const pathname = usePathname();
  return pathname;
};
