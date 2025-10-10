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

  return {
    authUser,
    userChecked,
    fetchCurrentUser,
    setCurrentUser,
  };
}
