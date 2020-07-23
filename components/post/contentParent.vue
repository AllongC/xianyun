<template>
  <div>
    <contentParent v-if="contentList.parent" :contentList="contentList.parent" />
    {{contentList.content}}
  </div>
</template>

<script>
export default {
  name: "contentParent",
  props: ["contentList"]
};
</script>

<style lang="less" scoped>
</style>