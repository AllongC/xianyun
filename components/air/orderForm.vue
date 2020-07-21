<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info" :model="{users}" ref="formUser">
        <div class="member-info-item" v-for="(item,index) in users" :key="index">
          <el-form-item
            label="乘机人"
            :prop="`users[${index}].username`"
            :rules="[
                  {required:true,message:'请输入乘客姓名',trigger:'blur'}
                ]"
          >
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username"></el-input>
          </el-form-item>

          <el-form-item
            label="证件类型"
            :prop="`users[${index}].id`"
            :rules="[
                  {required:true,message:'请输入乘客身份证',trigger:'blur'}
                ]"
          >
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item">
          <el-checkbox-group v-model="checkList">
            <div v-for="(item,index) in data.insurances" :key="index">
              <el-checkbox :label="item.id">航空意外险：￥{{item.price}}/份×1 最高赔付{{item.compensation}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form
          label-width="80px"
          :model="{
                 contactPhone,
                 contactName,
                 captcha,
                }"
          :rules="rules"
          ref="formContact"
        >
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>

    <el-dialog
      title="请先登录/注册"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <LoginForm v-if="currentId==0" @LoginSuccess="dialogVisible = false" />
      <RegisterForm v-if="currentId==1" @changeId="dialogVisible = false" />
      <span slot="footer" class="dialog-footer" @click="toggleStatus">
        {{currentInfo[currentId]}}
        <i class="el-icon-arrow-right"></i>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import LoginForm from "@/components/user/LoginForm";
import RegisterForm from "@/components/user/RegisterForm";
export default {
  components: {
    LoginForm,
    RegisterForm
  },
  props: {
    data: Object
  },
  data() {
    return {
      users: [
        {
          username: "",
          id: ""
        }
      ],
      currentId: 0,
      currentInfo: ["没有账号，前往注册", "已有账号，请登录"],
      dialogVisible: false,
      checkList: [],
      contactPhone: "",
      contactName: "",
      captcha: "",
      totalPrice: 0,
      rules: {
        contactPhone: [
          {
            required: true,
            message: "请输入手机号码",
            trigger: "blur"
          }
        ],
        contactName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        captcha: [
          {
            required: true,
            message: "请输入验证码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  watch: {
    users: {
      handler() {
        this.computedPrice();
      },
      immediate: true
    },
    checkList: {
      handler() {
        this.computedPrice();
      },
      immediate: true
    }
  },
  methods: {
    toggleStatus() {
      if (this.currentId == 0) {
        this.currentId = 1;
      } else {
        this.currentId = 0;
      }
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    computedPrice() {
      let price = 0;
      price += this.data.seat_infos.org_settle_price * this.users.length;
      this.data.insurances.forEach(item => {
        if (this.checkList.indexOf(item.id) >= 0) {
          price += item.price * this.users.length;
        }
      });
      console.log(price);
      this.totalPrice = price;
      this.$emit("getPrice", this.totalPrice);
    },
    // 添加乘机人
    handleAddUsers() {
      this.users.push({
        name: "",
        id: ""
      });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      this.$axios({
        url: "/captchas",
        method: "post",
        data: {
          tel: this.contactPhone
        }
      }).then(res => {
        const { code } = res.data;
        if (code) {
          this.$message.success("获取成功,验证码为：" + code);
          this.captcha = code;
        }
      });
    },

    // 提交订单
    async handleSubmit() {
      if (!this.$store.state.user.userInfo.token) {
        this.dialogVisible = true;
        return;
      }
      const data = {
        users: this.users,
        insurances: this.checkList,
        invoice: false,
        seat_xid: this.$route.query.seat_xid,
        air: this.$route.query.id,
        contactPhone: this.contactPhone,
        contactName: this.contactName,
        captcha: this.captcha
      };
      const formUser = await this.$refs.formUser.validate().catch(e => {});
      const Contact = await this.$refs.formContact.validate().catch(e => {});
      if (formUser && Contact) {
        this.$axios({
          url: "/airorders",
          method: "post",
          data,
          headers: {
            Authorization: "Bearer " + this.$store.state.user.userInfo.token
          }
        }).then(res => {
          const { data, message } = res.data;
          if (message == "订单提交成功") {
            this.$message.success(message);
            setTimeout(() => {
              this.$router.push("/air/pay?id=" + data.id);
            }, 1000);
          }
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.el-checkbox {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #dcdfe6;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
.dialog-footer {
  font-size: 12px;
  color: #66b1ff;
  margin-top: 15px;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>