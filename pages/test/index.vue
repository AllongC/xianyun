<template>
  <div>
    <contentPage :contentList="item" v-for="(item,index) in contentList" :key="index" />
  </div>
</template>

<script>
import contentPage from "@/components/post/contentPage";
export default {
  components: {
    contentPage
  },
  data() {
    return {
      contentList: [
        {
          content: "想起的我，想起的你"
        },
        {
          content: "三是青春物语",
          parent: {
            content: "一是婴儿哭啼，二是玩游戏"
          }
        },
        {
          content: "四是了解你",
          parent: {
            content: "三是青春物语",
            parent: {
              content: "一是婴儿哭啼，二是玩游戏"
            }
          }
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
</style>