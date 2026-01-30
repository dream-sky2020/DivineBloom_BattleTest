<script setup lang="ts">
import type { Condition } from '../schemas/condition';

const props = defineProps<{
  modelValue: Partial<Condition>;
}>();

const emit = defineEmits(['update:modelValue']);

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
  <div class="editor-card">
    <h3>判定条件配置</h3>
    <div class="form-group">
      <label>名称:</label>
      <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" placeholder="如: 血量检查" />
    </div>
    
    <div class="form-group">
      <label>属性 ID:</label>
      <input :value="modelValue.attributeId" @input="e => updateField('attributeId', (e.target as HTMLInputElement).value)" placeholder="如: hp, atk" />
    </div>

    <div class="form-group">
      <label>操作符:</label>
      <select :value="modelValue.op" @change="e => updateField('op', (e.target as HTMLSelectElement).value)">
        <option v-for="op in ops" :key="op.value" :value="op.value">{{ op.label }}</option>
      </select>
    </div>

    <div class="form-group">
      <label>目标值 (Value):</label>
      <input :value="modelValue.value" @input="e => updateField('value', (e.target as HTMLInputElement).value)" placeholder="数值或布尔值" />
    </div>
  </div>
</template>

<style scoped>
.editor-card {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #42b883;
  width: 100%;
  box-sizing: border-box;
}
.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 6px;
  font-weight: 500;
}
input, select {
  background: #1a1a1a;
  border: 1px solid #444;
  color: white;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;
}
input:focus, select:focus {
  border-color: #42b883;
  outline: none;
}
</style>
