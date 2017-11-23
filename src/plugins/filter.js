import Vue from 'vue'

Vue.filter('template', function (value) {
    return value + 'template';
});

