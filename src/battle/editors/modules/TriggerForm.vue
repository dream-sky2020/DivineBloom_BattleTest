<script setup lang="ts">
import type { Trigger } from '../../schemas/trigger';
import TriggerNodeForm from './TriggerNodeForm.vue';

const props = defineProps<{
  modelValue: Trigger;
}>();

const emit = defineEmits(['update:modelValue', 'delete']);

const updateField = (field: keyof Trigger, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="module-form trigger-form">
    <div class="form-header">
      <span class="id-badge">Trigger: {{ modelValue.uuid }}</span>
      <button class="mini-del-btn" @click="$emit('delete')">Remove</button>
    </div>
    
    <div class="form-group">
      <label>Trigger Name</label>
      <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
    </div>

    <div class="logic-tree-box">
      <label>Logic Tree</label>
      <TriggerNodeForm :modelValue="modelValue.root" @update:modelValue="val => updateField('root', val)" />
    </div>
  </div>
</template>

<style scoped>
.module-form { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 12px; margin-bottom: 10px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.id-badge { font-size: 10px; background: #9b59b644; color: #9b59b6; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
.mini-del-btn { background: transparent; border: 1px solid #555; color: #ff5555; font-size: 10px; padding: 2px 6px; border-radius: 3px; cursor: pointer; }
.form-group label { display: block; font-size: 10px; color: #666; margin-bottom: 4px; }
.form-group input { width: 100%; background: #000; border: 1px solid #444; color: #ccc; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.logic-tree-box label { font-size: 10px; color: #666; display: block; margin: 10px 0 5px 0; }
</style>
