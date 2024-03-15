<template>
  <div class="gacha-view">
    <!--以下为欢迎页部分-->
    <Transition name="fade" appear v-show="is_welcome && !is_login">
      <div class="open-1">
        <img
          src="../assets/click.svg"
          class="click"
          @click="is_welcome = false"
        />
      </div>
    </Transition>

    <!--以下为登录部分-->
    <Transition name="login-image" appear v-show="!is_login && !is_welcome">
      <img src="../assets/login-image.png" class="login-image" />
    </Transition>
    <Transition name="login-title" appear v-show="!is_login && !is_welcome">
      <img src="../assets/login-title.svg" class="login-title" />
    </Transition>
    <Transition name="login-box" appear v-show="!is_login && !is_welcome">
      <div class="login-box">
        <input
          class="login-input first-input"
          v-model="studentNumber"
          type="text"
          placeholder="请输入账号"
        />
        <input
          class="login-input"
          v-model="password"
          type="password"
          placeholder="请输入密码"
        />
        <button class="log-in" @click="login()">登入</button>
      </div>
    </Transition>
    <Transition name="fade" appear v-show="!is_login && !is_welcome">
      <p class="text">微北洋账号登陆</p>
    </Transition>

    <!--以下为抽签部分-->
    <Transition name="fade" appear v-show="is_login && is_gacha">
      <p class="gacha-text">来抽一张卡吧，少年~</p>
    </Transition>
    <Transition name="gacha-self" appear v-show="is_login && is_gacha">
      <img
        src="../assets/gacha-self.png"
        :class="['gacha-self', is_shake ? 'up-and-down-gacha' : '']"
      />
    </Transition>
    <Transition name="gacha-bundle" appear v-show="is_login && is_gacha">
      <img
        src="../assets/gacha-bundle.png"
        :class="[
          'gacha-bundle',
          is_gacha ? 'gacha-scale' : '',
          is_shake ? 'up-and-down' : '',
        ]"
        @click="shake()"
      />
    </Transition>
    <Transition name="fade" appear v-show="is_login && is_gacha">
      <img
        src="../assets/collection-entry.png"
        :class="['collection-entry', is_gacha ? 'gacha-scale' : '']"
        @click="(is_gacha = false), (is_check = true), check_card()"
      />
    </Transition>

    <!--以下为查看卡片页面-->
    <Transition name="fade" v-if="is_card">
      <CardComponent :id="card_id" @cancel="is_card = !is_card" />
    </Transition>

    <!--以下为查看已有卡牌页面-->
    <Transition name="fade" v-show="is_check">
      <div class="check-box">
        <img
          src="../assets/to-gacha.svg"
          class="to-gacha"
          @click="(is_check = false), (is_gacha = true)"
        />
        <div class="card-content">
          <img
            v-for="(item, index) in user_card"
            @click="look_card(index)"
            class="card-self"
            :src="
              item ? YesCard : NoCard
            "
          />
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import YesCard from "../assets/yes-card.png"
import NoCard from "../assets/no-card.png"
import CardComponent from "../Components/CardComponent.vue";
import { Transition, ref } from "vue";
import axios from "axios";
import Cookies from "js-cookie";

const studentNumber = ref("");
const password = ref("");
const is_login = ref(false);
const is_gacha = ref(true);
const is_shake = ref(false);
const is_welcome = ref(true);
const card_id = ref("0");
const is_card = ref(false);
const is_check = ref(false);
const user_card = ref([
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
]);

if (Cookies.get("user_info")) is_login.value = true;

async function login() {
  let res;
  if (!studentNumber.value || !password.value) {
    alert("账号密码未输入!");
    return;
  }
  try {
    res = await axios.post("https://letter.twt.edu.cn/api/user/login", {
      studentNumber: studentNumber.value,
      password: password.value,
      username: studentNumber.value,
    });
  } catch (err) {
    alert("登录错误!");
    return;
  }
  const data = res.data;
  Cookies.set("user_info", data.result);
  is_login.value = true;
}
function shake() {
  gacha();
  is_shake.value = true;
  setTimeout(() => {
    is_shake.value = false;
    is_card.value = true;
  }, 1000);
}

async function gacha() {
  let res;
  try {
    res = await axios.get("https://letter.twt.edu.cn/api/card/draw", {
      headers: {
        token: `${Cookies.get("user_info")}`,
      },
    });
  } catch (err) {
    alert("抽卡错误!");
    return;
  }
  card_id.value = res.data.result.path;
}

async function check_card() {
  let res;
  try {
    res = await axios.get("https://letter.twt.edu.cn/api/card/all", {
      headers: {
        token: `${Cookies.get("user_info")}`,
      },
    });
  } catch (err) {
    alert("检查卡片出错!");
    return;
  }
  res.data.result.forEach((Element) => {
    user_card.value[Element - 1] = true;
  });
  console.log(res.data.result);
}

function look_card(index) {
  if (user_card.value[index]) {
    is_card.value = true;
    card_id.value = String(index + 1);
  } else alert("此卡片未收集喵~");
}

</script>
<style scoped>
.text{
  position: absolute;
  left:5%;
  width:90%;
  top:70%;
  text-align: center;
  color:#b2a39c;
}
.check-box{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height:100vh;
  width:100vw;
}
.to-gacha {
  height: 5vh;
  margin:5vh;
  z-index:100;
}
.open-1 {
  height: 100vh;
  width: 100vw;
  background-image: url("../assets/open-1.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
}
.click {
  position: absolute;
  bottom: 10vh;
  left: 35vw;
  height: 30vw;
  width: 30vw;
  animation: smooth-fade 2.5s infinite;
}
@keyframes smooth-fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
.gacha-text {
  color: #ffb8a1;
  font-size: 23px;
  position: absolute;
  width: 80%;
  text-align: center;
  bottom: 2%;
  left: 10%;
  font-weight: bold;
}
.collection-entry {
  position: absolute;
  width: 15%;
  right: 6%;
  top: 18%;
}
.card-content {
  width: 100vw;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  position: absolute;
  bottom: 10vw;
  left: 0;
}
.card-self {
  width: 30vw;
  margin-top: 2.5vw;
}
@keyframes gachaBundle {
  0% {
    bottom: 7%;
    opacity: 0;
  }
  100% {
    bottom: 9%;
    opacity: 1;
  }
}
@keyframes gachaSelf {
  0% {
    bottom: 30%;
    opacity: 0;
  }
  100% {
    bottom: 32%;
    opacity: 1;
  }
}
.gacha-bundle-enter-active {
  animation: gachaBundle 1s;
}
.gacha-bundle-leave-active {
  animation: gachaBundle 1s reverse;
}
.gacha-self-enter-active {
  animation: gachaSelf 1s;
}
.gacha-self-leave-active {
  animation: gachaSelf 1s reverse;
}
.gacha-self {
  height: 37.5%;
  position: absolute;
  bottom: 32%;
}
.gacha-bundle {
  height: 37.5%;
  position: absolute;
  bottom: 9%;
}
.gacha-scale {
  animation: bold 3s infinite;
}
.up-and-down {
  animation: upAndDown 1s;
}
.up-and-down-gacha {
  animation: upAndDownGacha 1s;
}
@keyframes upAndDownGacha {
  0% {
    bottom: 32%;
  }
  12.5% {
    bottom: 42%;
  }
  25% {
    bottom: 32%;
  }
  37.5% {
    bottom: 42%;
  }
  50% {
    bottom: 32%;
  }
  100% {
    bottom: 32%;
  }
}
@keyframes upAndDown {
  0% {
    bottom: 9%;
  }
  12.5% {
    bottom: 17%;
  }
  25% {
    bottom: 9%;
  }
  37.5% {
    bottom: 17%;
  }
  50% {
    bottom: 9%;
  }
  100% {
    bottom: 9%;
  }
}
@keyframes bold {
  0% {
    transform: scale(0.95, 0.95);
  }
  50% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(0.95, 0.95);
  }
}
@keyframes loginImage {
  0% {
    top: 16%;
    opacity: 0;
    transform: scale(0, 0);
  }
  100% {
    top: 18%;
    opacity: 1;
    transform: scale(1, 1);
  }
}
@keyframes loginTitle {
  0% {
    top: 25%;
    opacity: 0;
    transform: scale(0, 0);
  }
  100% {
    top: 27%;
    opacity: 1;
    transform: scale(1, 1);
  }
}
@keyframes loginBox {
  0% {
    top: 37%;
    opacity: 0;
  }
  100% {
    top: 33%;
    opacity: 1;
  }
}
.login-box-enter-active {
  animation: loginBox 1.5s;
}
.login-box-leave-active {
  animation: loginBox 1.5s reverse;
}
.login-image-enter-active {
  animation: loginImage 1.5s;
}
.login-image-leave-active {
  animation: loginImage 1s reverse;
}
.login-title-enter-active {
  animation: loginTitle 1.5s;
}
.login-title-leave-active {
  animation: loginTitle 1s reverse;
}
input::placeholder {
  color: #b2a39c;
}

.log-in {
  width: 33%;
  height: 15%;
  margin-top: 1.8%;
  box-shadow: 0 0 1vh rgba(0, 0, 0, 0.3);
  background: #f5bf6c;
  color: #745528;
  border: 4px #745528 solid;
  font-size: 20px;
  font-weight: bold;
  border-radius: 1.5vh;
}

.login-input {
  background: #f1e2da;
  font-size: 18px;
  height: 3.5vh;
  border: 4px #745528 solid;
  width: 70%;
  margin: 2vw;
  border-radius: 2vw;;
  padding: 1vh;
}

.first-input {
  margin-top: 23%;
}

.login-image {
  width: 75%;
  position: absolute;
  top: 18%;
}

.login-title {
  width: 100%;
  position: absolute;
  top: 27%;
  left: 2.5%;
}

.title-box-image {
  height: 100%;
}

.gacha-view {
  height: 100%;
  width: 100%;
  background-image: url("../assets/main-background.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bundle {
  position: relative;
  bottom: 2vw;
}

.right-cat {
  position: relative;
}

.login-title-box {
  position: absolute;
  top: 20%;
  height: 10%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.login-title {
  width: 100%;
  z-index: 1;
}

.login-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 33%;
  width: 90%;
  height: 40%;
  background-image: url("../assets/login-box.svg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: 50% 0%;
}
@media screen and (max-height:500px) {
  .login-box{
    top:20%;
    height:50%;
  }
  .login-image{
    opacity: 0;
    z-index:-1;
  }
  .login-title{
    opacity: 0;
    z-index:-1;
  }
  .first-input{
    margin-top:15vw;
  }
  .login-input{
    height:8%;
    border-radius: 2vw;
    width:33vh;
  }
  .log-in{
    font-size:15px;
  }
}
</style>
