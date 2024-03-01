<template>
  <div class="app">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<style>
.app{
  height:100%;
  width:100%;
}
.fade-enter-active{
  animation: fade 1s;
}
.fade-leave-active{
  animation: fade 1s reverse;
}
@keyframes fade{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>