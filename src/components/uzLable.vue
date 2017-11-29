<template>
    <span class="role" v-if="role != '回答者'" v-bind:class="getRoleClass(role)">{{role}}</span>
</template>

<script>
    export default {
        name: 'uzLable',
        data() {
            return {};
        },
        props: {
            role: {
                type: String,
                default: ''
            },
        },
        created() {
            if (!this.src) {
                this.src = 'empty';
            }
        },
        methods: {
            getRoleClass(role) {
                if (role == '金牌管家') {
                    return 'role-guanjia';
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../assets/scss/px2rem";

    .role {
        font-size: px2rem(12);
        padding: px2rem(2) px2rem(5);
        border-radius: px2rem(10);
        border: px2rem(1) solid #333;
    }

    .role-guanjia {
        border-color: rgb(255, 182, 0);
        color: rgb(255, 182, 0);
        background-color: rgb(254, 250, 229);
    }
</style>