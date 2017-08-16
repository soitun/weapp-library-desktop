<template>
    <div class="wrap">
        <v-head></v-head>
        <feedback></feedback>
        <transition name="fade" mode="out-in">
            <div class="content">
                <router-view>
                </router-view>
            </div>
        </transition>
    </div>
</template>
<script>
import vHead from './components/Header.vue';
import feedback from '../components/Feedback.vue';
export default {
    components: {
        vHead, feedback
    }
}
</script>
<style scoped>
.content {
    background: none repeat scroll 0 0 #fff;
    width: 100%;
    padding: 40px;
    box-sizing: border-box;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .3s
}

.fade-enter,
.fade-leave-to
/* .fade-leave-active in <2.1.8 */

{
    opacity: 0
}
</style>