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
        <div v-if="dateList.length">
          <FlightsItem v-for="(item,index) in dateList" :key="index" :flights="item" />
        </div>
        <div v-if="!dateList.length" class="none">暂无该航班机票</div>
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
  components: {
    FlightsListHead,
    FlightsItem
  },
  data() {
    return {
      flights: [],
      dateList: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  methods: {
    currentList() {
      const start = this.pageSize * (this.currentPage - 1);
      const end = this.pageSize * this.currentPage;
      this.dateList = this.flights.slice(start, end);
    },
    changePage(page) {
      this.currentPage = page;
      this.currentList();
    },
    changeSize(size) {
      this.pageSize = size;
      this.currentList();
    }
  },
  created() {
    this.$axios({
      url: "/airs",
      method: "get",
      params: this.$route.query
    }).then(res => {
      this.total = res.data.total;
      this.flights = res.data.flights;
      this.currentList();
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
.none {
  height: 300px;
  line-height: 300px;
  text-align: center;
  color: #666;
}
.el-pagination {
  text-align: center;
}
</style>