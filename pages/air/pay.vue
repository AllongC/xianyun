<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price" v-if="data">￥ {{data.price}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage" ref="canvas"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      data: null
    };
  },
  watch: {
    "$store.state.user.userInfo.token": {
      handler: function() {
        if (this.$store.state.user.userInfo.token) {
          this.$axios({
            url: "/airorders/" + this.$route.query.id,
            headers: {
              Authorization: "Bearer " + this.$store.state.user.userInfo.token
            },
            method: "get"
          }).then(res => {
            const { data } = res;
            this.data = data;
            QRCode.toCanvas(this.$refs.canvas, data.payInfo.code_url, {
              width: 200
            });
            this.checkPay();
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    checkPay() {
      this.$axios({
        url: "/airorders/checkpay",
        method: "post",
        data: {
          id: this.data.id,
          nonce_str: this.data.price,
          out_trade_no: this.data.payInfo.order_no
        },
        headers: {
          Authorization: "Bearer " + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        const { statusTxt, trade_state } = res.data;
        if (trade_state == "NOTPAY") {
          console.log(statusTxt);
          setTimeout(() => {
            this.checkPay();
          }, 2000);
        }
        this.patStates(trade_state);
      });
    },
    patStates(trade_state) {
      if (trade_state == "SUCCESS") {
        this.$message("支付成功");
      } else if (trade_state == "REFUND") {
        this.$message("转入退款");
      } else if (trade_state == "CLOSED") {
        this.$message("已关闭");
      } else if (trade_state == "REVOKED") {
        this.$message("已撤销");
      } else if (trade_state == "USERPAYING") {
        this.$message("用户支付中");
      } else if (trade_state == "PAYERROR") {
        this.$message("支付失败");
      }
    }
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>