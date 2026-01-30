<script setup lang="ts">
import type { AttributeComponent } from '../../schemas/attribute';

const props = defineProps<{
  modelValue: AttributeComponent;
}>();

const emit = defineEmits(['update:modelValue', 'delete']);

const valueTypes = [
  { label: '整数 (int)', value: 'int' },
  { label: '浮点数 (float)', value: 'float' },
  { label: '布尔值 (bool)', value: 'bool' },
];

const updateField = (field: keyof AttributeComponent, value: any) => {
  const newData = { ...props.modelValue, [field]: value };
  if (field === 'valueType') {
    if (value === 'int') newData.value = Math.floor(Number(newData.value) || 0);
    else if (value === 'float') newData.value = Number(newData.value) || 0;
    else if (value === 'bool') newData.value = !!newData.value;
  }
  emit('update:modelValue', newData);
};
</script>

<template>
  <div class="module-form attribute-form">
    <div class="form-header">
      <span class="id-badge">{{ modelValue.id }}</span>
      <button class="mini-del-btn" @click="$emit('delete')">Remove</button>
    </div>
    
    <div class="form-grid">
      <div class="form-group">
        <label :for="'attr-name-' + modelValue.id">Name</label>
        <input :id="'attr-name-' + modelValue.id" name="attr-name" :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
      </div>
      
      <div class="form-group">
        <label :for="'attr-type-' + modelValue.id">Type</label>
        <select :id="'attr-type-' + modelValue.id" name="attr-type" :value="modelValue.valueType" @change="e => updateField('valueType', (e.target as HTMLSelectElement).value)">
          <option v-for="t in valueTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label :for="'attr-val-' + modelValue.id">Value</label>
        <select v-if="modelValue.valueType === 'bool'" :id="'attr-val-' + modelValue.id" name="attr-value" :value="modelValue.value" @change="e => updateField('value', (e.target as HTMLSelectElement).value === 'true')">
          <option :value="true">True</option>
          <option :value="false">False</option>
        </select>
        <input v-else :id="'attr-val-' + modelValue.id" name="attr-value" type="number" :value="modelValue.value" @input="e => updateField('value', modelValue.valueType === 'int' ? parseInt((e.target as HTMLInputElement).value) : parseFloat((e.target as HTMLInputElement).value))" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-form {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 10px;
}
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.id-badge {
  font-size: 10px;
  background: #333;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
}
.mini-del-btn {
  background: transparent;
  border: 1px solid #555;
  color: #ff5555;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 100px 100px;
  gap: 10px;
}
.form-group label {
  display: block;
  font-size: 10px;
  color: #666;
  margin-bottom: 4px;
}
.form-group input, .form-group select {
  width: 100%;
  background: #000;
  border: 1px solid #444;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
