<script setup lang="ts">
import type { AttributeComponent } from '../schemas/attribute';

const props = defineProps<{
  modelValue: Partial<AttributeComponent>;
}>();

const emit = defineEmits(['update:modelValue']);

const valueTypes = [
  { label: '整数 (int)', value: 'int' },
  { label: '浮点数 (float)', value: 'float' },
  { label: '布尔值 (bool)', value: 'bool' },
];

const updateField = (field: keyof AttributeComponent, value: any) => {
  const newData = { ...props.modelValue, [field]: value };
  
  // 当类型改变时，尝试转换现有的值
  if (field === 'valueType') {
    if (value === 'int') newData.value = Math.floor(Number(newData.value) || 0);
    else if (value === 'float') newData.value = Number(newData.value) || 0;
    else if (value === 'bool') newData.value = !!newData.value;
  }
  
  emit('update:modelValue', newData);
};
</script>

<template>
  <div class="editor-card attribute-editor">
    <h3>属性组件配置 (Attribute)</h3>
    <div class="form-group">
      <label>属性 ID (唯一键):</label>
      <input :value="modelValue.id" @input="e => updateField('id', (e.target as HTMLInputElement).value)" placeholder="如: strength" />
    </div>
    
    <div class="form-group">
      <label>显示名称:</label>
      <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>数据类型:</label>
        <select :value="modelValue.valueType" @change="e => updateField('valueType', (e.target as HTMLSelectElement).value)">
          <option v-for="t in valueTypes" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>

      <div class="form-group">
        <label>数值 (Value):</label>
        <template v-if="modelValue.valueType === 'bool'">
          <select :value="modelValue.value" @change="e => updateField('value', (e.target as HTMLSelectElement).value === 'true')">
            <option :value="true">TRUE (真)</option>
            <option :value="false">FALSE (假)</option>
          </select>
        </template>
        <template v-else>
          <input 
            type="number" 
            :value="modelValue.value" 
            @input="e => updateField('value', modelValue.valueType === 'int' ? parseInt((e.target as HTMLInputElement).value) : parseFloat((e.target as HTMLInputElement).value))" 
          />
        </template>
      </div>
    </div>

    <div class="form-group">
      <label>持有者 UUID:</label>
      <input :value="modelValue.ownerUuid" @input="e => updateField('ownerUuid', (e.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<style scoped>
.attribute-editor {
  border-left: 4px solid #569cd6;
}
.form-row { display: flex; gap: 15px; }
.editor-card { background: #2a2a2a; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; flex: 1; }
label { font-size: 13px; color: #aaa; margin-bottom: 6px; }
input, select { background: #1a1a1a; border: 1px solid #444; color: white; padding: 10px; border-radius: 4px; width: 100%; }
</style>
