export interface JwtPayload {
  id: string;
  roles: string[];
  email: string;
  iat?: number; // Opcional: Fecha de emisión del token
  exp?: number; // Opcional: Fecha de expiración del token
}
