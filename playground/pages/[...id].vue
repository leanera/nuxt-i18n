<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    definePageMeta({
      middleware() {
        if (process.client)
          return navigateTo('/')
      },
    })

    return () => []
  },
})
</script>
