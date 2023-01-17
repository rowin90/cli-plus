import { config } from '@/config';

export const getConfig =  () => {
  // const store = config.store
  const store = config;
  console.log(
    JSON.stringify(store, null, 2)
  );
  return store as unknown;
};
