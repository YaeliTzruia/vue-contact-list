<template>
  <div id="app">
    <UsersBox />
  </div>
</template>

<script>
import UsersBox from "./components/Box.vue";

export default {
  name: "App",
  components: {
    UsersBox,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1%;
}
body {
  line-height: 1.3;
  width: 100%;
  background-color: #efeeee;
  height: 100%;
}
</style>
