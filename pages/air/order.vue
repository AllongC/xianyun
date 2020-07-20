<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <!-- 订单表单 -->
      <div class="main">
        <OrderForm v-if="order.insurances" :insurances="order.insurances" />
      </div>

      <!-- 侧边栏 -->
      <div class="aside"></div>
    </el-row>
  </div>
</template>

<script>
import OrderForm from "@/components/air/orderForm.vue";

export default {
  components: {
    OrderForm
  },
  data() {
    return {
      order: []
    };
  },
  mounted() {
    this.$axios({
      url: "/airs/" + this.$route.query.id,
      method: "get",
      params: this.$route.query.seat_xid
    }).then(res => {
      const { data } = res;
      this.order = data;
    });
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 20px auto;
}

/*aside*/
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}
</style>