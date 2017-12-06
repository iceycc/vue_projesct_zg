<template>
    <img :src="src" :class="classStyle" class="default" @click="onClick"/>
</template>

<script>
    const img_loading = require('../assets/img/logo.png');

    export default {
        name: 'ImgWrapper',
        data() {
            return {
                imgObj: {
                    src: this.src,
                    loading: img_loading
                },
            };
        },
        props: {
            src: {
                type: String,
                default: ''
            },
            classStyle: {
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
            onClick() {
                this.$emit('onClick');
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../assets/scss/px2rem";
    .default {
        width: px2rem(25);
        height: px2rem(25);
    }
</style>