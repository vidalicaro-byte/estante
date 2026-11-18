import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "./favorites-store";

export function useFavorites() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

const subscribeNoop = () => () => {};

/** false while rendering on the server and during hydration, true afterwards. */
export function useHydrated() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}
