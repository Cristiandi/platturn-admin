<template>
  <table class="table table-sm table-responsive-sm">
    <thead>
      <tr>
        <th
          v-for="key in columns"
          :key="key"
          @click="sortBy(key)"
          :class="{ active: sortKey == key }"
          scope="col"
        >
          {{ key | capitalize }}
          <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="entry in filteredRows" :key="entry.id">
        <td v-for="key in columns" :key="key">
          <ActionsColumn
            v-if="key === 'actions'"
            v-bind:actions="entry[key]"
            v-bind:bus="bus"
            v-bind:row="entry"
          />
          <span v-else>{{ entry[key] }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
import ActionsColumn from "./ActionsColumn";

export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    filterKey: {
      type: String,
      default: null
    },
    bus: {
      type: Object,
      defult: null
    }
  },
  data() {
    let sortOrders = {};
    this.columns.forEach(function(key) {
      sortOrders[key] = 1;
    });

    return {
      sortKey: "",
      sortOrders
    };
  },
  computed: {
    filteredRows() {
      const sortKey = this.sortKey;
      const filterKey = this.filterKey && this.filterKey.toLowerCase();
      const order = this.sortOrders[sortKey] || 1;
      let rows = this.rows;

      if (filterKey) {
        rows = rows.filter(row => {
          return Object.keys(row).some(key => {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            );
          });
        });
      }
      if (sortKey) {
        rows = rows.slice().sort(function(a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return rows;
    }
  },
  filters: {
    capitalize: function(str) {
      // return str.charAt(0).toUpperCase() + str.slice(1);
      return str.toUpperCase();
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    }
  },
  components: {
    ActionsColumn
  }
};
</script>
<style scoped>
table {
  margin-top: 1rem;
}
</style>
