import Vue from "vue";
import App from "./App.vue";
import * as VeeValidate from "vee-validate";

Vue.use(VeeValidate);

Vue.config.productionTip = false;
Vue.component("validation-observer", VeeValidate.ValidationObserver);

Vue.component("validation-provider", VeeValidate.ValidationProvider);
new Vue({
  render: (h) => h(App),
}).$mount("#app");
