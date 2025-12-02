export interface VariableDefinition {
  value: string;
  label: string;
  type: 'numeric' | 'categorical';
  unit?: string;
}

export const AVAILABLE_VARIABLES: VariableDefinition[] = [
  {
    value: 'produccion_leche_ayer',
    label: 'Producción Leche Ayer',
    type: 'numeric',
    unit: 'kg',
  },
  {
    value: 'produccion_media_7dias',
    label: 'Producción Media 7 Días',
    type: 'numeric',
    unit: 'kg',
  },
  {
    value: 'dias_ordeno',
    label: 'Días Ordeño',
    type: 'numeric',
    unit: 'días',
  },
  {
    value: 'estado_reproduccion',
    label: 'Estado Reproductivo',
    type: 'categorical',
  },
  {
    value: 'nombre_grupo',
    label: 'Grupo',
    type: 'categorical',
  },
  {
    value: 'recomendacion',
    label: 'Recomendación',
    type: 'categorical',
  },
];

export const getVariableDefinition = (value: string): VariableDefinition | undefined => {
  return AVAILABLE_VARIABLES.find((v) => v.value === value);
};

export const isNumericVariable = (value: string): boolean => {
  const def = getVariableDefinition(value);
  return def?.type === 'numeric';
};
