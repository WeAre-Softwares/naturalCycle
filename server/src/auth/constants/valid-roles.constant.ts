export const VALID_ROLES = {
  admin: 'admin',
  empleado: 'empleado',
  usuario: 'usuario',
} as const;

export type validRoles = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];
