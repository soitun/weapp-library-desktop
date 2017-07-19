<template>
    <div class="wrap">
        <v-head></v-head>
        <transition name="move" mode="out-in">
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
