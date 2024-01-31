import { view } from './index.js';

interface LoadRemoveChunk {
  x: number;
  y: number;
}

export const LoadRemoveChunkView = view.create<LoadRemoveChunk>({
  type: 'object',
  $id: 'LoadRemoveChunk',
  properties: {
    x: { type: 'integer', btype: 'uint16' },
    y: { type: 'integer', btype: 'uint16' },
  },
});
