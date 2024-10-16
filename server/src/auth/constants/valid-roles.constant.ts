export const VALID_ROLES = ['admin', 'empleado', 'usuario'] as const;

export type ValidRoles = (typeof VALID_ROLES)[number];
