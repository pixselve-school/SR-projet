import { View, ViewConstructor } from 'structurae';
import { ComplexView } from 'structurae/view-types';

export const view = new View();

export function encode<T>(
  message: T,
  typeView: ViewConstructor<T, ComplexView<T>>
): Uint8Array {
  return new Uint8Array(typeView.from(message).buffer);
}

export function decode<T>(
  buffer: ArrayBuffer,
  typeView: ViewConstructor<T, ComplexView<T>>
): T {
  return typeView.decode(new DataView(buffer));
}

export * from './add-orb.js';
export * from './remove-orb.js';
