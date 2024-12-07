const zLayers = ['tilemap', 'player', 'obstacle'] as const;
export const zIndices = Object.fromEntries(
  zLayers.map((name, i) => [name, i]),
) as Record<(typeof zLayers)[number], number>;
