<script setup lang="ts">
const routes = useRouter().getRoutes()

useTestResult(
  // eslint-disable-next-line unused-imports/no-unused-vars
  routes.map(({ components, ...rest }) => rest),
)
</script>
