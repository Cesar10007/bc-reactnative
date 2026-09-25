export interface Item {
  id: string | number;
  name: string;
  image: string;
  description: string;
  price: number;
  flavor: string;
  doughType: 'delgada' | 'gruesa';
}
export type CreateItemPayload = Omit<Item, 'id'>;
export interface UpdateItemPayload extends CreateItemPayload { id: string | number }
export interface ItemsWithSource { items: Item[]; source: 'network' | 'cache' }

export interface AuthTokens { accessToken: string; refreshToken: string }
export interface AuthUser {
  id: number; username: string; email: string; firstName: string; lastName: string; image?: string;
}
export interface JwtPayload { sub: number; username: string; iat: number; exp: number }
export interface LoginCredentials { username: string; password: string }
export interface RegisterData { username: string; email: string; password: string; firstName?: string; lastName?: string }
export interface AuthResponse extends AuthTokens {
  id: number; username: string; email: string; firstName: string; lastName: string; image: string;
}
