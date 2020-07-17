<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div>
          <FlightsItem v-for="(item,index) in currentFlights" :key="index" :flights="item" />
          <el-pagination
            @size-change="changeSize"
            @current-change="changePage"
            :current-page="currentPage"
            :page-sizes="[5,10,15,20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/FlightsListHead";
import FlightsItem from "@/components/air/FlightsItem";
export default {
  data() {
    return {
      flights: [],
      currentFlights: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
      const start = this.pageSize * (this.currentPage - 1);
      const end = this.pageSize * this.currentPage;
      this.currentFlights = this.flights.slice(start, end);
    },
    changeSize(size) {
      this.pageSize = size;
      const start = this.pageSize * (this.currentPage - 1);
      const end = this.pageSize * this.currentPage;
      this.currentFlights = this.flights.slice(start, end);
    }
  },
  components: {
    FlightsListHead,
    FlightsItem
  },
  created() {
    this.$axios({
      url: "/airs",
      method: "get",
      params: this.$route.query
    }).then(res => {
      this.total = res.data.total;
      this.flights = res.data.flights;
      const start = this.pageSize * (this.currentPage - 1);
      const end = this.pageSize * this.currentPage;
      this.currentFlights = this.flights.slice(start, end);
    });
  }
};
</script>

<style lang="less" scoped>
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>