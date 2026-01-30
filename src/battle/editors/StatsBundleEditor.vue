<script setup lang="ts">
import type { StatsBundle } from '../schemas/statsBundle';
import { ref } from 'vue';

const props = defineProps<{
  modelValue: Partial<StatsBundle>;
}>();

const emit = defineEmits(['update:modelValue']);

const newId = ref('');

const updateField = (field: keyof StatsBundle, value: any) => {
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};

const addId = () => {
  if (!newId.value) return;
  const currentUuids = props.modelValue.attributeUuids || [];
  if (!currentUuids.includes(newId.value)) {
    updateField('attributeUuids', [...currentUuids, newId.value]);
  }
  newId.value = '';
};

const removeId = (id: string | number) => {
  const currentUuids = props.modelValue.attributeUuids || [];
  updateField('attributeUuids', currentUuids.filter(u => u !== id));
};
</script>

<template>
  <div class="editor-card bundle-editor">
    <h3>属性包配置 (StatsBundle)</h3>
    
    <div class="form-group">
      <label>包名称:</label>
      <input :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
    </div>

    <div class="form-group">
      <label>包含的属性 ID 列表 (Attribute IDs):</label>
      <div class="id-input-group">
        <input v-model="newId" @keyup.enter="addId" placeholder="输入属性 ID 并按回车" />
        <button @click="addId">添加</button>
      </div>
      <div class="id-tags">
        <span v-for="id in modelValue.attributeUuids" :key="id" class="id-tag">
          {{ id }}
          <button @click="removeId(id)" class="remove-btn">×</button>
        </span>
      </div>
    </div>

    <div class="form-group">
      <label>持有者 UUID:</label>
      <input :value="modelValue.ownerUuid" @input="e => updateField('ownerUuid', (e.target as HTMLInputElement).value)" />
    </div>
  </div>
</template>

<style scoped>
.bundle-editor {
  border-left: 4px solid #ce9178;
}
.id-input-group { display: flex; gap: 10px; margin-bottom: 10px; }
.id-input-group button { background: #42b883; border: none; color: black; padding: 0 15px; border-radius: 4px; cursor: pointer; }
.id-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
.id-tag { background: #1a1a1a; border: 1px solid #444; padding: 4px 10px; border-radius: 4px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.remove-btn { background: transparent; border: none; color: #ff5555; cursor: pointer; font-size: 16px; padding: 0; line-height: 1; }
.editor-card { background: #2a2a2a; padding: 20px; border-radius: 8px; width: 100%; box-sizing: border-box; }
.form-group { margin-bottom: 15px; display: flex; flex-direction: column; }
label { font-size: 13px; color: #aaa; margin-bottom: 6px; }
input { background: #1a1a1a; border: 1px solid #444; color: white; padding: 10px; border-radius: 4px; width: 100%; }
</style>
