<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" @focus="getFocus('username')" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" @focus="getFocus('captcha')" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" @focus="getFocus('nickname')" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        @focus="getFocus('password')"
        v-model="form.password"
      ></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="confpwd">
      <el-input
        placeholder="确认密码"
        type="password"
        @focus="getFocus('confpwd')"
        v-model="form.confpwd"
      ></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    const validatorPwd = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      form: {
        username: "",
        nickname: "",
        captcha: "",
        password: "",
        confpwd: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名手机", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confpwd: [{ validator: validatorPwd, trigger: "blur" }]
      }
    };
  },
  methods: {
    getFocus(val) {
      this.$refs.form.clearValidate(val);
    },
    // 发送验证码
    handleSendCaptcha() {
      this.$axios({
        url: "/captchas",
        method: "post",
        data: {
          tel: this.form.username
        }
      }).then(res => {
        const { data } = res;
        this.form.captcha = data.code;
        this.$confirm("验证码为:" + data.code, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success",
          center: true
        });
      });
    },

    // 注册
    handleRegSubmit() {
      this.$refs.form.validate((flag, res) => {
        if (flag) {
          const { confpwd, ...data } = this.form;
          this.$store.dispatch("user/register", data).then(res => {
            this.$refs.form.resetFields();
            this.$confirm("注册成功", "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "success",
              center: true
            }).then(res => {
              this.$emit("changeId");
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>