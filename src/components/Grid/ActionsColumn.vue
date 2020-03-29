<template>
  <div v-if="actions.length" class="row">
    <div class="col-md-12">
      <button
        type="button"
        v-for="action in actions"
        :key="action.name"
        :class="action.class"
        @click.prevent="handleClick(action.eventName, row)"
      >
        <font-awesome-icon
          v-if="action.name === 'edit'"
          icon="edit"
          size="xs"
        />
        <font-awesome-icon
          v-else-if="action.name === 'delete'"
          icon="trash-alt"
          size="xs"
        />
        <font-awesome-icon
          v-else-if="action.name === 'view'"
          icon="eye"
          size="xs"
        />
        <span v-else>{{ action.description }}</span>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ActionsColumn",
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    row: {
      type: Object,
      default: null
    },
    bus: {
      type: Object,
      defult: null
    }
  },
  methods: {
    handleClick(eventName, p1) {
      // console.log("eventName", eventName);
      // console.log("p1", p1);
      this.bus.$emit(eventName, p1);
    }
  }
};
</script>
<style scoped>
button {
  margin-right: 0.2rem;
}
</style>
