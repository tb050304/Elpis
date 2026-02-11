import { ref, watch, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import { useMenuStore } from "$store/menu.js";

export const useSchema = function () {
  const route = useRoute();
  const menuStore = useMenuStore();

  const api = ref("");
  const tableSchema = ref({});
  const tableConfig = ref({});
  const searchSchema = ref({});
  const searchConfig = ref({});

  //构造schemaConfig 相关配置，输送给 schemaView 解释
  const buildData = function () {
    const { key, sider_key: siderKey } = route.query;
    const mItem = menuStore.findMenuItem({
      key: "key",
      value: siderKey ?? key,
    });

    if (mItem && mItem.schemaConfig) {
      const { schemaConfig: sConfig } = mItem;
      const configSchema = JSON.parse(JSON.stringify(sConfig.schema));

      api.value = sConfig.api ?? "";

      tableSchema.value = {};
      tableConfig.value = undefined;
      searchSchema.value = {};
      searchConfig.value = undefined;
      nextTick(() => {
        //构造 tableSchema 和 tableConfig
        tableSchema.value = buildDtoSchema(configSchema, "table");
        tableConfig.value = sConfig.tableConfig;
        //构造 searchhSchema和searchConfig
        const dtoSearchSchema = buildDtoSchema(configSchema, "search");
        for (const key in dtoSearchSchema.properties) {
          if (route.query[key] !== undefined) {
            dtoSearchSchema.properties[key].option.default = route.query[key];
          }
        }
        searchSchema.value = dtoSearchSchema;
        searchConfig.value = sConfig.searchConfig;
      });
    }
  };

  //通用构建方法 (清除噪音)
  const buildDtoSchema = (_schema, comName) => {
    if (!_schema?.properties) {
      return {};
    }
    const dtoSchema = {
      type: "object",
      properties: {},
    };

    //提取有效 schema 字段信息
    for (const key in _schema.properties) {
      const props = _schema.properties[key];
      if (props[`${comName}Option`]) {
        let dtoProps = {};
        for (const pKey in props) {
          //提取 props 中非 option 的部分，存放到 dtoProps 中
          if (pKey.indexOf("Option") < 0) {
            dtoProps[pKey] = props[pKey];
          }
        }
        //处理 comName Option
        dtoProps = Object.assign({}, dtoProps, {
          option: props[`${comName}Option`],
        });
        dtoSchema.properties[key] = dtoProps;
      }
    }

    return dtoSchema;
  };

  watch(
    [
      () => route.query.key,
      () => route.query.sider_key,
      () => menuStore.menuList,
    ],
    () => {
      buildData();
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    buildData();
  });
  return {
    api,
    tableSchema,
    tableConfig,
    searchSchema,
    searchConfig,
  };
};
