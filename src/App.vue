<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
* {
    margin: 0;
    padding: 0;
}

html,
body,
#app {
    width: 100%;
    height: 100%;
}


a {
    color: #20a0ff;
    text-decoration: none;
    cursor: pointer;
}

a:hover,
a:active {
    color: rgba(32, 160, 255, .8);
}
</style>