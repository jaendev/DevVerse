import { useAuthStore } from './auth.store';
import { useUserStore } from './user.store';

export { useAuthStore } from './auth.store';
export { useThemeStore } from './theme.store';
export { useUserStore } from './user.store';

export const resetAllStores = () => {
  useAuthStore.getState().logout();
  useUserStore.getState().resetState();
}