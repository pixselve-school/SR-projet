import { ViewConstructor } from 'structurae';
import { ComplexView } from 'structurae/view-types';

export function encode<T>(
  message: T,
  typeView: ViewConstructor<T, ComplexView<T>>
): Uint8Array {
  return new Uint8Array(typeView.from(message).buffer);
}

export function decode<T>(
  buffer: ArrayBuffer,
  typeView: ViewConstructor<T, any>
): T {
  return typeView.decode(new DataView(buffer));
}

export * from './add-orb.js';
export * from './remove-orb.js';
export * from './load-remove-chunk.js';
