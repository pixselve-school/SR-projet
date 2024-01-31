import { View } from 'structurae';
import { colors } from './utils';
import { OrbDTO } from './types';

const view = new View();

interface OrbType {
  points: number;
  color: number;
  id: string;
  x: number;
  y: number;
}

view.create<OrbType>({
  type: 'object',
  $id: 'Orb',
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
});

const Orbs = view.create<Array<OrbType>>({
  type: 'array',
  items: {
    type: 'object',
    $ref: '#Orb',
  },
});
export function orbsToPacket(orb: OrbType[]) {
  return new Uint8Array(Orbs.from(orb).buffer);
}
export function packetToOrbs(packet: ArrayBuffer): OrbDTO[] {
  const orbs = Orbs.decode(new DataView(packet));
  return orbs.map((orb) => ({
    id: orb.id,
    position: { x: orb.x, y: orb.y },
    points: orb.points,
    color: colors[orb.color],
  }));
}
