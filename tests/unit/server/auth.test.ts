import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  load as loginLoad,
  actions as loginActions,
} from '../../../src/routes/(auth)/login/+page.server';
import {
  load as registerLoad,
  actions as registerActions,
} from '../../../src/routes/(auth)/register/+page.server';
import { load as logoutLoad } from '../../../src/routes/logout/+page.server';
import {
  createMockPrismaClient,
  createMockCookies,
  createMockRequest,
  mockSvelteKitImports,
} from '../../helpers/mocks';
import { createUser, mockAuthCookie } from '../../helpers/factories';

// Mock Prisma
vi.mock('$lib/server/database', () => ({
  prisma: createMockPrismaClient(),
}));

// Mock SvelteKit imports
vi.mock('@sveltejs/kit', () => mockSvelteKitImports());

describe('Authentication Functions', () => {
  let mockPrisma: ReturnType<typeof createMockPrismaClient>;
  let mockCookies: ReturnType<typeof createMockCookies>;
  const { redirect: _redirect, error: _error, fail: _fail } = mockSvelteKitImports();

  beforeEach(() => {
    vi.clearAllMocks();
    const database = vi.importActual('$lib/server/database') as any;
    mockPrisma = database.prisma;
    mockCookies = createMockCookies();
  });

  describe('Login', () => {
    describe('load function', () => {
      it('should redirect to home if already authenticated', async () => {
        const user = createUser();
        mockCookies.set('mock-auth', mockAuthCookie(user));

        expect.assertions(1);

        try {
          await loginLoad({ cookies: mockCookies } as any);
        } catch (e: any) {
          expect(e.location).toBe('/');
        }
      });

      it('should return empty object if not authenticated', async () => {
        const result = await loginLoad({ cookies: mockCookies } as any);
        expect(result).toEqual({});
      });
    });

    describe('actions', () => {
      it('should login with valid credentials', async () => {
        const user = createUser({ email: 'test@example.com' });
        mockPrisma.user.findUnique.mockResolvedValue(user);

        const formData = {
          email: 'test@example.com',
          password: 'password123',
        };

        const request = createMockRequest(formData);

        expect.assertions(2);

        try {
          await loginActions.default({ request, cookies: mockCookies } as any);
        } catch (e: any) {
          expect(e.location).toBe('/');
        }

        expect(mockCookies.set).toHaveBeenCalledWith(
          'mock-auth',
          expect.stringContaining('test@example.com'),
          expect.objectContaining({
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })
        );
      });

      it('should fail with non-existent user', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null);

        const formData = {
          email: 'nonexistent@example.com',
          password: 'password123',
        };

        const request = createMockRequest(formData);

        const result = await loginActions.default({ request, cookies: mockCookies } as any);

        expect(result.status).toBe(400);
        expect(result.data.email).toBe('nonexistent@example.com');
        expect(result.data.error).toBe('メールアドレスまたはパスワードが正しくありません');
      });

      it('should validate required fields', async () => {
        const formData = {
          email: '',
          password: '',
        };

        const request = createMockRequest(formData);

        const result = await loginActions.default({ request, cookies: mockCookies } as any);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('すべての項目を入力してください');
      });
    });
  });

  describe('Register', () => {
    describe('load function', () => {
      it('should redirect to home if already authenticated', async () => {
        const user = createUser();
        mockCookies.set('mock-auth', mockAuthCookie(user));

        expect.assertions(1);

        try {
          await registerLoad({ cookies: mockCookies } as any);
        } catch (e: any) {
          expect(e.location).toBe('/');
        }
      });
    });

    describe('actions', () => {
      it('should register new user', async () => {
        mockPrisma.user.findUnique.mockResolvedValue(null); // No existing user
        const newUser = createUser({ email: 'new@example.com', name: 'New User' });
        mockPrisma.user.create.mockResolvedValue(newUser);

        const formData = {
          email: 'new@example.com',
          password: 'password123',
          name: 'New User',
        };

        const request = createMockRequest(formData);

        expect.assertions(2);

        try {
          await registerActions.default({ request, cookies: mockCookies } as any);
        } catch (e: any) {
          expect(e.location).toBe('/');
        }

        expect(mockPrisma.user.create).toHaveBeenCalledWith({
          data: {
            email: 'new@example.com',
            name: 'New User',
            role: 'author',
          },
        });
      });

      it('should fail if email already exists', async () => {
        const existingUser = createUser({ email: 'existing@example.com' });
        mockPrisma.user.findUnique.mockResolvedValue(existingUser);

        const formData = {
          email: 'existing@example.com',
          password: 'password123',
          name: 'New User',
        };

        const request = createMockRequest(formData);

        const result = await registerActions.default({ request, cookies: mockCookies } as any);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('このメールアドレスは既に登録されています');
      });

      it('should validate required fields', async () => {
        const formData = {
          email: 'test@example.com',
          password: '',
          name: '',
        };

        const request = createMockRequest(formData);

        const result = await registerActions.default({ request, cookies: mockCookies } as any);

        expect(result.status).toBe(400);
        expect(result.data.error).toBe('すべての項目を入力してください');
      });
    });
  });

  describe('Logout', () => {
    it('should clear auth cookie and redirect to home', async () => {
      const user = createUser();
      mockCookies.set('mock-auth', mockAuthCookie(user));

      expect.assertions(2);

      try {
        await logoutLoad({ cookies: mockCookies } as any);
      } catch (e: any) {
        expect(e.location).toBe('/');
      }

      expect(mockCookies.delete).toHaveBeenCalledWith('mock-auth', { path: '/' });
    });
  });
});
