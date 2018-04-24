<template>
    <img :src="url ? url : defaultImg" :class="classStyle" class="default" @click="onClick" @error="error"/>
</template>

<script>
    import defaultImg from '../../assets/img/icon_slider.png';
    import error from '../../assets/img/icon_user_qu.svg';

    export default {
        name: 'ImgWrapper',
        data() {
            return {
                defaultImg: defaultImg
            };
        },
        props: {
            url: {
                type: String,
                default: ''
            },
            classStyle: {
                type: String,
                default: ''
            },
        },
        created() {
        },
        methods: {
            onClick() {
                this.$emit('onClick');
            },
            error() {
                this.src = error;
            }
        }
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/scss/px2rem";

    .default {
        width: px2rem(25);
        height: px2rem(25);
    }
    .avatar {
        border-radius: 50%;
        margin-right: px2rem(2);
    }

</style>
