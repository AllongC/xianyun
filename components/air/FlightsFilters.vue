<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{route.departCity}} - {{route.destCity}}
        /
        {{route.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="selectOptions">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in options.airport"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="selectOptions">
          <el-option
            :label="`${item.from}:00 - ${item.to}:00 `"
            :value="[item.from,item.to]"
            v-for="(item,index) in options.flightTimes"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="selectOptions">
          <el-option
            :label="item"
            :value="item"
            v-for="(item,index) in options.company"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="selectOptions">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="(item,index) in Size"
            :key="index"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    options: Object,
    flights: Array
  },
  data() {
    return {
      route: {},
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", // 机型大小
      Size: [
        {
          label: "大",
          value: "L"
        },
        {
          label: "中",
          value: "M"
        },
        {
          label: "小",
          value: "S"
        }
      ]
    };
  },
  mounted() {
    this.route = this.$route.query;
  },
  methods: {
    selectOptions() {
      let dateList = [...this.flights];
      if (this.airport) {
        dateList = dateList.filter(item => {
          return item.org_airport_name == this.airport;
        });
        this.$emit("changeDate", dateList);
      }
      if (this.flightTimes) {
        dateList = dateList.filter(item => {
          const time = Number(item.dep_time.split(":")[0]);
          return this.flightTimes[0] < time && this.flightTimes[1] > time;
        });
        this.$emit("changeDate", dateList);
      }
      if (this.company) {
        dateList = dateList.filter(item => {
          return item.airline_name == this.company;
        });
        this.$emit("changeDate", dateList);
      }
      if (this.airSize) {
        dateList = dateList.filter(item => {
          return item.plane_size == this.airSize;
        });
        this.$emit("changeDate", dateList);
      }
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";
      const dateList = this.flights;
      this.$emit("changeDate", dateList);
    }
  }
};
</script>

<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>