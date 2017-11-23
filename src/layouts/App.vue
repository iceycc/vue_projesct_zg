<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    import {EventBus, Constants, mixins} from '../assets/js/index';

    export default {
        name: 'app',
        mixins: [mixins.base, mixins.request],
        data() {
            return {
                open: false,
                docked: false,
                toast: false,
                toast_message: '',
                toastTimer: null
            };
        },
        created() {
            EventBus.$on(Constants.EventBus.showToast, value => {
                this.showMessage(value);
            });

            this.$ls.set(Constants.LocalStorage.test, '10001');
            this.getdata();
        },
        methods: {
            getdata() {
                this.doRequest(Constants.Method.test, null, (result) => {
                });
            },
            showMessage(value) {
                this.toast = true;
                this.toast_message = value.message;

                if (this.toastTimer) clearTimeout(this.toastTimer);
                this.toastTimer = setTimeout(() => {
                    this.toast = false;
                }, 2000);
            },
        }
    };
</script>

<style lang="scss">
    @import "../assets/scss/base";
</style>
