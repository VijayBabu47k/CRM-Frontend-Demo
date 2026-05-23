import authReducer, {
  setCredentials,
  updateUser,
  logout,
  setLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAdmin,
} from '@/store/features/authSlice';

describe('Auth Slice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  };

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    role: 'user' as const,
    status: 'active' as const,
    createdAt: '2024-01-01',
  };

  describe('reducers', () => {
    it('should handle initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setCredentials', () => {
      const token = 'test-token';
      const state = authReducer(initialState, setCredentials({ user: mockUser, token }));

      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(token);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle updateUser', () => {
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuthenticated: true,
      };

      const state = authReducer(stateWithUser, updateUser({ firstName: 'Updated' }));

      expect(state.user?.firstName).toBe('Updated');
      expect(state.user?.lastName).toBe('User');
    });

    it('should handle logout', () => {
      const stateWithUser = {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
      };

      const state = authReducer(stateWithUser, logout());

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle setLoading', () => {
      const state = authReducer(initialState, setLoading(true));
      expect(state.isLoading).toBe(true);
    });
  });

  describe('selectors', () => {
    const rootState = {
      auth: {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
      },
    };

    it('selectCurrentUser should return the current user', () => {
      expect(selectCurrentUser(rootState)).toEqual(mockUser);
    });

    it('selectIsAuthenticated should return authentication status', () => {
      expect(selectIsAuthenticated(rootState)).toBe(true);
    });

    it('selectIsAdmin should return false for regular user', () => {
      expect(selectIsAdmin(rootState)).toBe(false);
    });

    it('selectIsAdmin should return true for admin user', () => {
      const adminState = {
        auth: {
          ...rootState.auth,
          user: { ...mockUser, role: 'admin' as const },
        },
      };
      expect(selectIsAdmin(adminState)).toBe(true);
    });
  });
});
