import { colors } from '../utils.js';
import { View } from 'structurae';
const view = new View();

interface AddOrb {
  points: number;
  color: number;
  id: string;
  x: number;
  y: number;
}

export const AddOrbView = view.create<Array<AddOrb>>({
  type: 'array',
  $id: 'AddOrbs',
  items: {
    $id: 'AddOrb',
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 5, maxLength: 5 },
      x: { type: 'integer', btype: 'uint16' },
      y: { type: 'integer', btype: 'uint16' },
      points: { type: 'integer', minimum: 1, maximum: 10, btype: 'uint8' },
      color: {
        type: 'integer',
        maximum: colors.length - 1,
        minimum: 0,
        btype: 'uint8',
      },
    },
  },
});
