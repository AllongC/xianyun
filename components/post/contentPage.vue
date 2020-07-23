<template>
  <div class="contaniner">
    <contentParent v-if="contentList.parent" :contentList="contentList.parent" />
    {{contentList.content}}
  </div>
</template>

<script>
import contentParent from "@/components/post/contentParent";
export default {
  props: ["contentList"],
  components: {
    contentParent
  }
};
</script>

<style lang="less" scoped>
.contaniner {
  width: 1000px;
  margin: 0 auto;
  border: 1px solid #333;
  margin-top: 10px;
  padding: 10px;
}
</style>