import { ClassicPreset } from 'rete';
import type { Socket } from './socket/Socket';

export class Input<S extends Socket> extends ClassicPreset.Input<S> {}
