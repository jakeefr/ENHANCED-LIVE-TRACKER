import { useTwitch as useTwitchContext } from '@/context/TwitchContext';

export function useTwitch() {
  return useTwitchContext();
}