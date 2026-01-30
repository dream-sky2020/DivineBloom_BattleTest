<script setup lang="ts">
import type { Regulator } from '../schemas/regulator';

const props = defineProps<{
  modelValue: Partial<Regulator>;
}>();

const emit = defineEmits(['update:modelValue']);

const modes = [
  { label: '数值模式 (Value)', value: 'value' },
  { label: '百分比 (Percent)', value: 'percent' },
  { label: '反向百分比 (Inverse %)', value: 'inverse_percent' },
];

const types = [
  { label: '线性缩放 (Linear)', value: 'LINEAR_SCALING' },
  { label: '阈值加成 (Threshold)', value: 'THRESHOLD_BONUS' },
  { label: '变量比例 (Variable)', value: 'VARIABLE_SCALING' },
];

const ops = [
  { label: '加法 (+)', value: 'add' },
  { label: '乘法 (×)', value: 'mul' },
];

const updateField = (field: keyof Regulator, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<template>
  <div class="editor-card regulator-editor">
    <h3>调节器配置 (Regulator)</h3>
    
    <div class="form-section">
      <div class="form-group">
        <label>名称:</label>
        <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
      </div>
      
      <div class="form-group">
        <label>调节类型:</label>
        <select :value="modelValue.type" @change="e => updateField('type', (e.target as HTMLSelectElement).value)">
          <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label>数据源属性 ID (Source):</label>
        <input :value="modelValue.sourceAttributeId" @input="e => updateField('sourceAttributeId', (e.target as HTMLInputElement).value)" placeholder="如: atk" />
      </div>
      <div class="form-group" v-if="modelValue.mode !== 'value'">
        <label>最大值属性 ID (Max Source):</label>
        <input :value="modelValue.maxSourceAttributeId" @input="e => updateField('maxSourceAttributeId', (e.target as HTMLInputElement).value)" placeholder="如: maxHp" />
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label>计算模式 (Mode):</label>
        <select :value="modelValue.mode" @change="e => updateField('mode', (e.target as HTMLSelectElement).value)">
          <option v-for="m in modes" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
      </div>
      <div class="form-group">
        <label>操作符 (Op):</label>
        <select :value="modelValue.op" @change="e => updateField('op', (e.target as HTMLSelectElement).value)">
          <option v-for="o in ops" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
    </div>

    <div class="form-section">
      <div class="form-group">
        <label>系数 (Factor):</label>
        <input type="number" :value="modelValue.factor" @input="e => updateField('factor', parseFloat((e.target as HTMLInputElement).value))" step="0.1" />
      </div>
      <div class="form-group" v-if="modelValue.type === 'THRESHOLD_BONUS'">
        <label>阈值 (Threshold):</label>
        <input type="number" :value="modelValue.threshold" @input="e => updateField('threshold', parseFloat((e.target as HTMLInputElement).value))" />
      </div>
      <div class="form-group" v-if="modelValue.type === 'THRESHOLD_BONUS'">
        <label>奖励值 (Bonus):</label>
        <input type="number" :value="modelValue.bonusValue" @input="e => updateField('bonusValue', parseFloat((e.target as HTMLInputElement).value))" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.regulator-editor {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #f1c40f;
  width: 100%;
  box-sizing: border-box;
}
.form-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 13px;
  color: #aaa;
  margin-bottom: 6px;
}
input, select {
  background: #1a1a1a;
  border: 1px solid #444;
  color: white;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
}
</style>
