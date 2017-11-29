<template>
    <div id="app">
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
        <mu-toast v-if="toast.show" :message="toast.message"></mu-toast>
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
                toast: {
                    show: false,
                    message: '',
                    Timer: null
                },
            };
        },
        created() {
            EventBus.$on(Constants.EventBus.showToast, value => {
                this.showMessage(value);
            });

            this.$ls.set(Constants.LocalStorage.uid, '25416');
            this.getdata();
        },
        methods: {
            getdata() {
                this.doRequest(Constants.Method.test, null, (result) => {
                });
            },
            showMessage(value) {
                this.toast.show = true;
                this.toast.message = value.message;

                if (this.toast.Timer) clearTimeout(this.toast.Timer);
                this.toast.Timer = setTimeout(() => {
                    this.toast.show = false;
                }, 2000);
            },
        }
    };
</script>

<style lang="scss">
    @import "../assets/scss/base";
</style>
