<script setup lang="ts">
import type { Regulator } from '../../schemas/regulator';

const props = defineProps<{
  modelValue: Partial<Regulator>;
}>();

const emit = defineEmits(['update:modelValue', 'delete']);

const modes = [
  { label: 'Value', value: 'value' },
  { label: 'Percent', value: 'percent' },
  { label: 'Inv %', value: 'inverse_percent' },
];

const types = [
  { label: 'Linear', value: 'LINEAR_SCALING' },
  { label: 'Threshold', value: 'THRESHOLD_BONUS' },
  { label: 'Variable', value: 'VARIABLE_SCALING' },
];

const ops = [
  { label: '+', value: 'add' },
  { label: '×', value: 'mul' },
];

const updateField = (field: keyof Regulator, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="module-form regulator-form">
    <div class="form-header">
      <span class="id-badge">Regulator: {{ modelValue.id }}</span>
      <button class="mini-del-btn" @click="$emit('delete')">Remove</button>
    </div>
    
    <div class="form-grid">
      <div class="form-group">
        <label :for="'reg-name-' + modelValue.id">Name</label>
        <input :id="'reg-name-' + modelValue.id" name="reg-name" :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
      </div>
      
      <div class="form-group">
        <label :for="'reg-type-' + modelValue.id">Type</label>
        <select :id="'reg-type-' + modelValue.id" name="reg-type" :value="modelValue.type" @change="e => updateField('type', (e.target as HTMLSelectElement).value)">
          <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label :for="'reg-mode-' + modelValue.id">Mode</label>
        <select :id="'reg-mode-' + modelValue.id" name="reg-mode" :value="modelValue.mode" @change="e => updateField('mode', (e.target as HTMLSelectElement).value)">
          <option v-for="m in modes" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label :for="'reg-op-' + modelValue.id">Op</label>
        <select :id="'reg-op-' + modelValue.id" name="reg-op" :value="modelValue.op" @change="e => updateField('op', (e.target as HTMLSelectElement).value)">
          <option v-for="o in ops" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label :for="'reg-fac-' + modelValue.id">Factor</label>
        <input :id="'reg-fac-' + modelValue.id" name="reg-factor" type="number" step="0.1" :value="modelValue.factor" @input="e => updateField('factor', parseFloat((e.target as HTMLInputElement).value))" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-form { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 12px; margin-bottom: 10px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.id-badge { font-size: 10px; background: #f1c40f44; color: #f1c40f; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
.mini-del-btn { background: transparent; border: 1px solid #555; color: #ff5555; font-size: 10px; padding: 2px 6px; border-radius: 3px; cursor: pointer; }
.form-grid { display: grid; grid-template-columns: 1fr 120px 80px 60px 80px; gap: 10px; }
.form-group label { display: block; font-size: 10px; color: #666; margin-bottom: 4px; }
.form-group input, .form-group select { width: 100%; background: #000; border: 1px solid #444; color: #ccc; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
</style>
