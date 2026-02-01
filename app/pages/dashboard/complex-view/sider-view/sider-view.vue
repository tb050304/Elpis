<template>
  <sider-container>
    <template #menu-content>
      <el-menu
        :default-active="activeKey"
        :ellipsis="false"
        @select="onMenuSelect"
      >
        <template v-for="item in menuList">
          <!-- group -->
          <sub-menu
            v-if="item.subMenu && item.subMenu.length > 0"
            :menu-item="item"
          >
          </sub-menu>
          <el-menu-item v-else :index="item.key">
            {{ item.name }}
          </el-menu-item>
          <!-- module -->
        </template>
      </el-menu>
    </template>
    <template #main-content>
      <router-view></router-view>
    </template>
  </sider-container>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useMenuStore } from "$store/menu.js";
import SiderContainer from "$widgets/sider-container/sider-container.vue";
import SubMenu from "./complex-view/sub-menu/sub-menu.vue";

const router = useRouter();
const route = useRoute();
const menuStore = useMenuStore();

const menuList = ref([]);
const setMenuList = function () {
  const menuItem = menuStore.findMenuItem({
    key: "key",
    value: route.query.key,
  });

  if (menuItem && menuItem.siderConfig && menuItem.siderConfig.menu) {
    menuList.value = menuItem.siderConfig.menu;
  }
};

const activeKey = ref("");
const setActiveKey = function () {
  let siderMenuItem = menuStore.findMenuItem({
    key: "key",
    value: route.query.sider_key,
  });

  //如果首次加载 sider-view,用户未选中左侧菜单，需要默认选中第一个
  if (!siderMenuItem) {
    const hMenuItem = menuStore.findMenuItem({
      key: "key",
      value: route.query.key,
    });
    if (hMenuItem && hMenuItem.siderConfig && hMenuItem.siderConfig.menu) {
      const siderMenuList = hMenuItem.siderConfig.menu;
      siderMenuItem = menuStore.findFirstMenuItem(siderMenuList); //找出左侧菜单中的第一项
      if (siderMenuItem) {
        //TODO:处理选中菜单逻辑
        console.log("点击了------------");
        handleMenuSelect(siderMenuItem.key);
      }
    }
  }
  activeKey.value = siderMenuItem?.key;
};

watch(
  () => route.query.key,
  () => {
    setMenuList();
    setActiveKey();
  },
);

watch(
  () => menuStore.menuLIst,
  () => {
    setMenuList();
    setActiveKey();
  },
);

onMounted(() => {
  setMenuList();
  setActiveKey();
});

const onMenuSelect = function (menuKey) {
  //TODO:处理选中菜单逻辑
  handleMenuSelect(menuKey);
};

const handleMenuSelect = function (menuKey) {
  const menuItem = menuStore.findMenuItem({
    key: "key",
    value: menuKey,
  });

  const { moduleType, key, customConfig } = menuItem;
  //如果是当前页面，不处理
  if (key == route.query.sider_key) {
    return;
  }

  const pathMap = {
    iframe: "/iframe",
    schema: "/schema",
    custom: customConfig?.path,
  };

  router.push({
    path: `/sider${pathMap[moduleType]}`,
    query: {
      key: route.query.key,
      sider_key: key,
      proj_key: route.query.proj_key,
    },
  });
};
</script>

<style lang="less" scoped></style>
