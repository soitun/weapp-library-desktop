<template>
    <div class="wrap">
        <v-head></v-head>
        <transition name="fade" mode="out-in">
            <router-view>
            </router-view>
        </transition>
    </div>
</template>
<script>
import vHead from './Header.vue';
export default {
    components: {
        vHead
    }
}
</script>

<style scoped>
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
