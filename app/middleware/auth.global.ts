import { useAuthUser } from '@/composables/useAuthUser';

export default defineNuxtRouteMiddleware(async to => {
  const { authUser, userChecked, fetchCurrentUser } = useAuthUser();

  if (!userChecked.value) {
    await fetchCurrentUser();
  }

  if (to.path === '/login' || to.path === '/signup') {
    if (authUser.value) {
      return navigateTo('/');
    }
  }

  if (!authUser.value) {
    return navigateTo('/login');
  }
});
