<template>
    <div class="card">
        <Transition name="fade">
            <div :class="[is_01?'show-01':'disappear-01']" v-show="is_01 || is_1">
                <img :src="`https://letter.twt.edu.cn/images/0${props.id}.jpg`" class="image-01"/>
                <img src="../assets/cancel.svg" class="cancel-1" @click="emits('cancel')"/>
                <img src="../assets/to-left.svg" class="to-right" @click="is_01 = false, is_1 = true"/>
            </div>
        </Transition>
        <Transition name="fade">
            <div :class="[is_1?'show-1':'disappear-1']" v-show="is_01 || is_1">
                <img :src="`https://letter.twt.edu.cn/images/${props.id}-1.jpg`" class="image-1"/>
                <img src="../assets/to-right.svg" class="to-left" @click="is_01 = true, is_1 = false"/>
                <img src="../assets/cancel.svg" class="cancel-2" @click="emits('cancel')"/>
                <img src="../assets/share.svg" class="share" @click="is_01 = false, is_1 = false"/>
            </div>
        </Transition>
        <Transition name="fade">
            <div class="share-image-box"  v-show="!is_01 && !is_1">
                <button class="click-empty" @click="is_1 = true">返回</button>
                <img class="share-image" :src="`https://letter.twt.edu.cn/images/${props.id}.jpg`"/>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import { ref } from "vue"
const props = defineProps({
    id:String
});
const emits = defineEmits(["cancel"]);
const is_01 = ref(true);
const is_1 = ref(false);

</script>

<style scoped>
.card{
  position: absolute;
  top:0;
  left:0;
  z-index:10; 
  height:100vh;
  width:100vw;
  background:#00000050;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin:0;
}
.show-01{
    position: absolute;
    top:0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100vw;
    height:100vh;
    transition: all 1s;
}
.show-1{
    position: absolute;
    top:0;
    left:0;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100vw;
    height:100vh;
    transition: all 1s;
}
.disappear-01{
    position: fixed;
    top:0;
    left:-100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100vw;
    transition: all 1s;
    height:100vh;
}
.disappear-1{
    position: fixed;
    top:0;
    left:100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    width:100vw;
    transition: all 1s;
    height:100vh;
}
.image-01{
    height:90vh;
    
}
.image-1{
    height:90vh;
    
}
.cancel-1{
    width:6vw;
    position: absolute;
    bottom:9%;
    z-index: 100;
}
.cancel-2{
    width:5vw;
    position: absolute;
    bottom:8%;
    z-index: 100;
}
.to-right{
    position: absolute;
    right:0;
    z-index: 100;
}
.to-left{
    position: absolute;
    left:0;
    z-index: 100;
}
.share{
    position: absolute;
    width:20vw;
    top:25vw;
    right:8vw;
}
.share-image{
    width:100vw;
}
.share-image-box{
    position: absolute;
    height:100vh;
    width:100vw;
    top:0vw;
    left:0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.click-empty{
    padding:2%;
    min-height:40px;
    margin-top:5%;
    font-size: 20px;
    color:#FFFFFF;
    box-shadow: 0 0 1vh rgba(0, 0, 0, 0.3);
    background: #f5bf6c;
    color: #745528;
    border: 4px #745528 solid;
    font-size: 20px;
    font-weight: bold;
    border-radius: 1.5vh;
}
</style>