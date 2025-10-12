import { useAuthUser } from '@/composables/useAuthUser';

export default defineNuxtRouteMiddleware(async to => {
  const { authUser, userChecked, fetchCurrentUser } = useAuthUser();

  if (!userChecked.value) {
    await fetchCurrentUser();
  }

  if (to.path === '/login' || to.path === '/register') {
    if (authUser.value) {
      return navigateTo('/');
    }
    return;
  }

  if (!authUser.value) {
    return navigateTo('/login');
  }
});
