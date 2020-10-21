import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/styles/base.css";
import "@/assets/styles/el-rest.css";

Vue.use(ElementUI);

//路由前置钩子(导航守卫)
router.beforeEach((to, from, next) => {
  //用户登陆之后，localStorage中有token
  let token = localStorage.getItem("qf2005-token");
  if (token) {
    //如果是注册页面或者是登陆页面，直接放行
    next();
  } else {
    //没token
    if (to.path === "/") {
      next();
    } else {
      //访问的不是登入页，就要跳转到登陆页
      next({ path: "/" });
    }
  }
});

Vue.config.productionTip = false;

//按需引入
//import {Carousel} from "element-ui"
//注册组件
//Vue.component("el-carousel",Carousel)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
