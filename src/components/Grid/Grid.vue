<template>
  <div>
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
    <div class="d-flex justify-content-center">
      <ul class="pagination">
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Previous"
            @click.prevent="handlePageClick(1)"
          >
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only">Previous</span>
          </a>
        </li>
        <li
          :class="
            currentPage === page.pageNumber ? 'page-item active' : 'page-item'
          "
          v-for="page in pagination"
          :key="page.pageNumber"
        >
          <a
            class="page-link"
            href="#"
            @click.prevent="handlePageClick(page.pageNumber)"
            >{{ page.pageNumber }}</a
          >
        </li>
        <li class="page-item">
          <a
            class="page-link"
            href="#"
            aria-label="Next"
            @click.prevent="handlePageClick(lastPageNumber)"
          >
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only">Next</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import ActionsColumn from "./ActionsColumn";

export default {
  props: {
    rows: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: () => 0
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
      sortOrders,
      currentPage: 1,
      skip: 0
    };
  },
  computed: {
    filteredRows() {
      const limit = this.limit;
      const skip = this.skip;
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
      return rows.slice(skip, skip + limit);
      // return rows;
    },
    pagination() {
      const totalRows = this.rows.length;
      // eslint-disable-next-line no-unused-vars
      const pagesNumber = Math.ceil(totalRows / this.limit);

      // eslint-disable-next-line no-unused-vars
      /*
      const elaboratePagination = (number = 0, array = []) => {
        const toSkip = array[array.length - 1]
          ? array[array.length - 1].skip + this.limit
          : 0;

        const pageNumber = array.length + 1;

        const arrayToCall = [
          ...array,
          { limit: this.limit, skip: toSkip, pageNumber }
        ];

        if (number === arrayToCall.length) {
          return arrayToCall;
        }

        return elaboratePagination(number, arrayToCall);
      };
      */

      let paginationArrray = [];
      for (let i = 0; i < pagesNumber; i++) {
        const toSkip = paginationArrray[paginationArrray.length - 1]
          ? paginationArrray[paginationArrray.length - 1].skip + this.limit
          : 0;

        const pageNumber = paginationArrray.length + 1;
        paginationArrray = [
          ...paginationArrray,
          { limit: this.limit, skip: toSkip, pageNumber }
        ];
      }

      return paginationArrray;
    },
    lastPageNumber() {
      return this.pagination[this.pagination.length - 1].pageNumber;
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
    },
    handlePageClick(pageNumber = 1) {
      const askedPage = this.pagination[pageNumber - 1];
      this.limit = askedPage.limit;
      this.skip = askedPage.skip;
      this.currentPage = askedPage.pageNumber;
    }
  },
  mounted() {},
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
