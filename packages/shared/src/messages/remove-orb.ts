import { View } from 'structurae';

const view = new View();

interface RemoveOrb {
  id: string;
}

export const RemoveOrbView = view.create<RemoveOrb>({
  type: 'object',
  $id: 'RemoveOrb',
  properties: {
    id: { type: 'string', minLength: 5, maxLength: 5 },
  },
});
