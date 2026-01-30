<script setup lang="ts">
import type { Condition } from '../../schemas/condition';

const props = defineProps<{
  modelValue: Partial<Condition>;
}>();

const emit = defineEmits(['update:modelValue', 'delete']);

const ops = [
  { label: '小于', value: 'lt' },
  { label: '大于', value: 'gt' },
  { label: '小于等于', value: 'lte' },
  { label: '大于等于', value: 'gte' },
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '小于百分比', value: 'lt_percent' },
  { label: '大于百分比', value: 'gt_percent' },
  { label: '拥有', value: 'HAS' },
  { label: '不拥有', value: 'NOT_HAS' },
];

const updateField = (field: keyof Condition, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="module-form condition-form">
    <div class="form-header">
      <span class="id-badge">Condition: {{ modelValue.id }}</span>
      <button class="mini-del-btn" @click="$emit('delete')">Remove</button>
    </div>
    
    <div class="form-grid">
      <div class="form-group">
        <label :for="'cond-name-' + modelValue.id">Name</label>
        <input :id="'cond-name-' + modelValue.id" name="cond-name" :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
      </div>
      
      <div class="form-group">
        <label :for="'cond-attr-' + modelValue.id">Attr ID</label>
        <input :id="'cond-attr-' + modelValue.id" name="cond-attr" :value="modelValue.attributeId" @input="e => updateField('attributeId', (e.target as HTMLInputElement).value)" />
      </div>

      <div class="form-group">
        <label :for="'cond-op-' + modelValue.id">Op</label>
        <select :id="'cond-op-' + modelValue.id" name="cond-op" :value="modelValue.op" @change="e => updateField('op', (e.target as HTMLSelectElement).value)">
          <option v-for="op in ops" :key="op.value" :value="op.value">{{ op.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label :for="'cond-val-' + modelValue.id">Value</label>
        <input :id="'cond-val-' + modelValue.id" name="cond-val" :value="modelValue.value" @input="e => updateField('value', (e.target as HTMLInputElement).value)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-form { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 12px; margin-bottom: 10px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.id-badge { font-size: 10px; background: #42b88344; color: #42b883; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
.mini-del-btn { background: transparent; border: 1px solid #555; color: #ff5555; font-size: 10px; padding: 2px 6px; border-radius: 3px; cursor: pointer; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 100px; gap: 10px; }
.form-group label { display: block; font-size: 10px; color: #666; margin-bottom: 4px; }
.form-group input, .form-group select { width: 100%; background: #000; border: 1px solid #444; color: #ccc; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
</style>
