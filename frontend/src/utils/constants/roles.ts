export const ROLES = {
  ADMIN: 1,
  COLAB: 2,
  PENDING_APPROVAL: 3,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<number, string> = {
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.COLAB]: 'Colaborador',
  [ROLES.PENDING_APPROVAL]: 'Pendiente de Aprobación',
};
