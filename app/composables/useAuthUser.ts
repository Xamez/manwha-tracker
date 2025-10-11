export function useAuthUser() {
  const authUser = useState<User | null>('auth:user', () => null);
  const userChecked = useState<boolean>('auth:userChecked', () => false);

  const fetchCurrentUser = async () => {
    if (userChecked.value) {
      return authUser.value;
    }

    const requestFetch = import.meta.server ? useRequestFetch() : $fetch;

    try {
      const response = await requestFetch('/api/auth/me');
      authUser.value = response ? (response as User) : null;
    } catch (error) {
      authUser.value = null;
      console.error('Failed to fetch current user:', error);
    } finally {
      userChecked.value = true;
    }

    return authUser.value;
  };

  const setCurrentUser = (user: User | null) => {
    authUser.value = user;
    userChecked.value = true;
  };

  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
      authUser.value = null;
      userChecked.value = true;
      await navigateTo('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return {
    authUser,
    userChecked,
    fetchCurrentUser,
    setCurrentUser,
    logout,
  };
}
