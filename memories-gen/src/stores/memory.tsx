import { createSignal } from 'solid-js';
import { MemoryType } from '~/data/model';

const [ editingMemory, setEditingMemory ] = createSignal<MemoryType | null>(null);


export {
  editingMemory,
  setEditingMemory,
};