<template>
  <div>
    <div class="container">
      <!-- 幻灯片 -->
      <el-carousel :interval="5000" arrow="always">
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <div
            class="banner-image"
            :style="`
                background:url(${item.url}) center center no-repeat;
                background-size:contain contain;
                `"
          ></div>
        </el-carousel-item>
      </el-carousel>
      <div class="banner-content">
        <div class="search-bar">
          <!-- tab栏 -->
          <el-row type="flex" class="search-tab">
            <span
              v-for="(item, index) in options"
              :key="index"
              @click="toggleActive(index)"
              :class="{active:index==activeId}"
            >
              <i>{{item.name}}</i>
            </span>
          </el-row>

          <!-- 输入框 -->
          <el-row type="flex" align="middle" class="search-input">
            <input
              :placeholder="options[this.activeId].text"
              v-model="keyword"
              @keyup.enter="search"
            />
            <i class="el-icon-search" @click="search"></i>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      banners: [],
      activeId: 0,
      keyword: "",
      options: [
        {
          name: "攻略",
          text: "搜索城市",
          path: "/post"
        },
        {
          name: "酒店",
          text: "请输入城市搜索酒店",
          path: "/hotel"
        },
        {
          name: "机票",
          text: "请输入出发点",
          path: "/air"
        }
      ]
    };
  },
  mounted() {
    this.$axios({
      url: "/scenics/banners",
      method: "get"
    }).then(res => {
      const { data } = res.data;
      this.banners = data.map(item => {
        return {
          ...item,
          url: this.$axios.defaults.baseURL + item.url
        };
      });
      console.log(this.banners);
    });
  },
  methods: {
    search() {
      const path = this.options[this.activeId].path;
      this.$router.push(path + "?keyword=" + this.keyword);
    },
    toggleActive(index) {
      this.activeId = index;
      if (this.activeId == 2) {
        this.$router.push("/air");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;

  /deep/ .el-carousel__container {
    height: 700px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
  /deep/ .el-carousel__container {
    height: 700px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }

  .banner-content {
    z-index: 9;
    width: 1000px;
    position: absolute;
    left: 50%;
    top: 45%;
    margin-left: -500px;
    border-top: 1px transparent solid;

    .search-bar {
      width: 552px;
      margin: 0 auto;
    }

    .search-tab {
      .active {
        i {
          color: #333;
        }
        &::after {
          background: #eee;
        }
      }

      span {
        width: 82px;
        height: 36px;
        display: block;
        position: relative;
        margin-right: 8px;
        cursor: pointer;

        i {
          position: absolute;
          z-index: 2;
          display: block;
          width: 100%;
          height: 100%;
          line-height: 30px;
          text-align: center;
          color: #fff;
        }

        &:after {
          position: absolute;
          left: 0;
          top: 0;
          display: block;
          content: "";
          width: 100%;
          height: 100%;
          border: 1px rgba(255, 255, 255, 0.2) solid;
          border-bottom: none;
          transform: scale(1.1, 1.3) perspective(0.7em) rotateX(2.2deg);
          transform-origin: bottom left;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 1px 2px 0 0;
          box-sizing: border-box;
        }
      }
    }

    .search-input {
      width: 550px;
      height: 46px;
      background: #fff;
      border-radius: 0 4px 4px 4px;
      border: 1px rgba(255, 255, 255, 0.2) solid;
      border-top: none;
      box-sizing: unset;

      input {
        flex: 1;
        height: 20px;
        padding: 13px 15px;
        outline: none;
        border: 0;
        font-size: 16px;
      }

      .el-icon-search {
        cursor: pointer;
        font-size: 22px;
        padding: 0 10px;
        font-weight: bold;
      }
    }
  }
}
</style>