<script>
import { RouterLink } from 'vue-router'

export default {
    name: 'appLink',

    props: {
        // add @ts-ignore if using TypeScript
        ...RouterLink.props
    },
    computed: {
        isExternalLink() {
            return typeof this.to === 'string' && this.to.startsWith('http')
        }
    }

}
</script>

<template>
    <a v-if="isExternalLink" :href="to">
        <slot />
    </a>
    <router-link v-else v-bind="$props">

        <slot />

    </router-link>
</template>