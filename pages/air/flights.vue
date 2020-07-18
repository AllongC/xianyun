<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div>
          <FlightsFilters
            v-if="totalFlights.options"
            :options="totalFlights.options"
            :flights="totalFlights.flights"
            @changeDate="changeDate"
          />
        </div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <div v-if="flights.length">
          <FlightsItem v-for="(item,index) in dateList" :key="index" :flights="item" />
        </div>
        <div v-if="!flights.length" class="none">暂无该航班机票</div>
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
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>
import FlightsListHead from "@/components/air/FlightsListHead";
import FlightsItem from "@/components/air/FlightsItem";
import FlightsFilters from "@/components/air/FlightsFilters";
import FlightsAside from "@/components/air/FlightsAside";
export default {
  components: {
    FlightsListHead,
    FlightsItem,
    FlightsFilters,
    FlightsAside
  },
  data() {
    return {
      totalFlights: [],
      flights: [],
      total: 0,
      pageSize: 5,
      currentPage: 1
    };
  },
  watch: {
    $route() {
      this.load();
    }
  },
  computed: {
    dateList() {
      const start = this.pageSize * (this.currentPage - 1);
      const end = this.pageSize * this.currentPage;
      return this.flights.slice(start, end);
    }
  },
  methods: {
    changePage(page) {
      this.currentPage = page;
    },
    changeSize(size) {
      this.pageSize = size;
    },
    changeDate(dateList) {
      this.flights = dateList;
      this.total = this.flights.length;
    },
    load() {
      this.$axios({
        url: "/airs",
        method: "get",
        params: this.$route.query
      }).then(res => {
        this.totalFlights = res.data;
        this.total = res.data.total;
        this.flights = res.data.flights;
      });
    }
  },
  created() {
    this.load();
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