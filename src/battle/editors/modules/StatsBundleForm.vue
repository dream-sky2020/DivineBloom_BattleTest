<script setup lang="ts">
import type { StatsBundle } from '../../schemas/statsBundle';
import { ref } from 'vue';

const props = defineProps<{
  modelValue: Partial<StatsBundle>;
}>();

const emit = defineEmits(['update:modelValue', 'delete']);

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
  <div class="module-form bundle-form">
    <div class="form-header">
      <span class="id-badge">Bundle: {{ modelValue.uuid }}</span>
      <button class="mini-del-btn" @click="$emit('delete')">Remove</button>
    </div>
    
    <div class="form-group">
      <label :for="'bundle-name-' + modelValue.uuid">Bundle Name</label>
      <input :id="'bundle-name-' + modelValue.uuid" name="bundle-name" :value="modelValue.name" @input="e => updateField('name', (e.target as HTMLInputElement).value)" />
    </div>

    <div class="form-group">
      <label :for="'bundle-attr-input-' + modelValue.uuid">Attribute IDs</label>
      <div class="id-input-row">
        <input :id="'bundle-attr-input-' + modelValue.uuid" name="bundle-attr-add" v-model="newId" @keyup.enter="addId" placeholder="Attr ID..." />
        <button class="add-tag-btn" @click="addId">+</button>
      </div>
      <div class="id-tags">
        <span v-for="id in modelValue.attributeUuids" :key="id" class="id-tag">
          {{ id }}
          <button @click="removeId(id)">×</button>
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-form { background: #1a1a1a; border: 1px solid #333; border-radius: 6px; padding: 12px; margin-bottom: 10px; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.id-badge { font-size: 10px; background: #ce917844; color: #ce9178; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
.mini-del-btn { background: transparent; border: 1px solid #555; color: #ff5555; font-size: 10px; padding: 2px 6px; border-radius: 3px; cursor: pointer; }
.form-group label { display: block; font-size: 10px; color: #666; margin-bottom: 4px; }
.form-group input { width: 100%; background: #000; border: 1px solid #444; color: #ccc; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
.id-input-row { display: flex; gap: 5px; margin-bottom: 5px; }
.add-tag-btn { background: #444; border: none; color: white; padding: 0 10px; border-radius: 4px; cursor: pointer; }
.id-tags { display: flex; flex-wrap: wrap; gap: 5px; }
.id-tag { background: #333; padding: 2px 8px; border-radius: 3px; font-size: 10px; display: flex; align-items: center; gap: 5px; }
.id-tag button { background: transparent; border: none; color: #666; cursor: pointer; font-size: 12px; }
</style>
