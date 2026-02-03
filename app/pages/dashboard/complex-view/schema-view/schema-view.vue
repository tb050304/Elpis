<template>
  <el-row class="schema-view">
    <search-panel></search-panel>
    <table-panel></table-panel>
  </el-row>
</template>

<script setup>
import { provide } from "vue";
import SearchPanel from "./complex-view/search-panel/search-panel.vue";
import TablePanel from "./complex-view/table-panel/table-panel.vue";
import { useSchema } from "./hook/schema.js";

const { api, tableSchema, tableConfig } = useSchema();

provide("schemaViewData", {
  api,
  tableSchema,
  tableConfig,
});
</script>

<style lang="less" scoped>
.schema-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
</style>
