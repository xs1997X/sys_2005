<template>
  <div class="login-page">
    <div class="login">
      <div class="left"></div>
      <div class="loginContainer">
        <h1>后台管理系统</h1>
        <el-form
          :model="loginForm"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="100px"
          class="demo-loginForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="loginForm.username"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <video
        src="./../../video/bg_video.d2d602a9.mp4"
        autoplay="autoplay"
        muted="muted"
        loop="loop"
        preload="auto"
      ></video>
    </div>
  </div>
</template>
<script>
//登入逻辑的实现

//1.收集用户输入的username&password传递给后端
//2.登入通过后，将后端返回的token存到本地 跳转到主页
//3.每次请求的时候，携带token到请求头 authorization
//4,。展示token校验正确的数据
//5.校验不通过，跳转到登入页
import { login } from "@/api";
import { mapMutations } from "vuex";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["userInfo"])
  },
  data() {
    //jsDoc
    /**
     * @param {object} rule 就是一个表单验证对象
     * @param {String} value 输入值
     * @param {Function} callback 校验
     */
    //检验用户名
    var validateUsername = (rule, value, callback) => {
      console.log(rule);
      console.log(value);
      var uPattern = /^[a-zA-Z0-9_-]{3,16}$/;
      if (!uPattern.test(value)) {
        callback("4到16位(字母，数字，下划线，减号)");
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        age: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations(["SET_USERINFO"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //代表本地校验通过
          //打开登入加载动画
          let { username, password } = this.loginForm;
          //发送登入请求
          const loading = this.$loading({
            lock: true,
            text: "Loading",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)"
          });
          login(username, password)
            .then(res => {
              //服务器响应 关闭loading动画
              loading.close();
              if (res.data.state) {
                this.$message.success("登入成功");
                //用户名和密码正确
                localStorage.setItem("qf2005-token", res.data.token);
                localStorage.setItem(
                  "qf2005-userInfo",
                  JSON.stringify(res.data.userInfo)
                );
                //设置更改vuex中state["userInfo"]
                this.SET_USERINFO(res.data.userInfo);
                //跳转到主页
                this.$router.push("/home");
              } else {
                //用户名和密码错误
                this.$message.error("用户名密码错误");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style scoped>
/* 表单样式 */
.el-form {
  width: 400px;
}
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left {
  width: 50%;
  height: 100%;
  background: url("http://chst.vip:8081/stu2/img/bg2.fc58c850.png") no-repeat;
  background-size: 50%;
  position: absolute;
  opacity: 0.7;
  background-position: 60% 65%;
}
.loginContainer {
  /* position: relative; */
  z-index: 9;
  width: 25rem;
  height: 30.47619048rem;
  position: absolute;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%);
  border-radius: 11px;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
}
.loginContainer h1 {
  display: block;
  font-size: 2em;
  margin-block-start: 0.67em;
  margin-block-end: 0.67em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-weight: bold;
  color: white;
  margin-top: 100px;
  margin-bottom: 50px;
}
.loginContainer .demo-loginForm {
  width: 350px;
  height: 188px;
}
.loginContainer .demo-loginForm .el-form-item__error {
  margin-bottom: 22px;
}
.el-form-item__content {
  margin-left: 100px;
  position: relative;
  width: 250px;
  height: 40px;
  overflow: hidden;
}

.loginContainer .el-button--primary {
  display: block;
  width: 250px;
  background: linear-gradient(90deg, #1596fb, #002dff);
  color: #fff;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  transition: 0.1s;
}
</style>
