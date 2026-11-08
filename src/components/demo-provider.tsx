'use client';
import { createContext, useContext, useEffect, useState, useSyncExternalStore } from 'react';
import { MockBookingGateway, STORAGE_KEY } from '@/lib/booking';
const Context = createContext<MockBookingGateway | null>(null);
export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [gateway] = useState(() => new MockBookingGateway());
  useEffect(() => {
    try {
      gateway.hydrate(window.localStorage);
    } catch {
      gateway.hydrate({ getItem: () => null, setItem: () => {}, removeItem: () => {} });
    }
    const sync = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) gateway.sync(e.newValue);
    };
    window.addEventListener('storage', sync);
    const timer = setInterval(() => gateway.expireHolds(), 1000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(timer);
    };
  }, [gateway]);
  return <Context.Provider value={gateway}>{children}</Context.Provider>;
}
export function useDemo() {
  const gateway = useContext(Context);
  if (!gateway) throw new Error('Missing DemoProvider');
  const state = useSyncExternalStore(
    gateway.subscribe,
    gateway.getSnapshot,
    gateway.getServerSnapshot,
  );
  const ready = useSyncExternalStore(gateway.subscribe, gateway.getReady, () => false);
  return { gateway, state, ready };
}
