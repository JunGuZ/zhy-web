<template>
  <div class="container">
    <h1>专利查询</h1>

    <div class="input-group">
      <label for="queryText">检索内容：</label>
      <input
          id="queryText"
          type="text"
          v-model="queryText"
          placeholder="请输入检索内容（小于15000字符）"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="offset">偏移量：</label>
      <input
          id="offset"
          type="number"
          v-model.number="offset"
          placeholder="默认: 0"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="limit">返回的专利个数：</label>
      <input
          id="limit"
          type="number"
          v-model.number="limit"
          placeholder="默认: 10"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="collapseBy">去重排序字段：</label>
      <input
          id="collapseBy"
          type="text"
          v-model="collapseBy"
          placeholder="默认: PBD"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="collapseType">去重条件：</label>
      <input
          id="collapseType"
          type="text"
          v-model="collapseType"
          placeholder="默认: DOCDB"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="collapseOrder">去重排序顺序：</label>
      <input
          id="collapseOrder"
          type="text"
          v-model="collapseOrder"
          placeholder="默认: LATEST"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="field">排序字段：</label>
      <input
          id="field"
          type="text"
          v-model="field"
          placeholder="默认: PBDT_YEARMONTHDAY"
          class="input-box"
      />
    </div>

    <div class="input-group">
      <label for="order">排序方式：</label>
      <input
          id="order"
          type="text"
          v-model="order"
          placeholder="默认: DESC"
          class="input-box"
      />
    </div>

    <button @click="searchPatents" class="search-button">检索</button>

    <div v-if="results.length" class="results">
      <h2>检索结果</h2>
      <p>当前条数目： {{ result_count }} 条结果</p>
      <p>找到： {{ totalSearchResults }} 条结果</p>

      <table class="results-table">
        <thead>
        <tr>
          <th>专利号</th>
          <th>ID</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="result in results" :key="result.patent_id">
          <td>{{ result.pn }}</td>
          <td>{{ result.patent_id }}</td>
        </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="changePage(-1)" :disabled="offset === 0">上一页</button>
        <button @click="changePage(1)" :disabled="offset + limit >= totalSearchResults">下一页</button>
      </div>
    </div>
    <div v-else>
      <p>请输入检索内容并点击“检索”</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      queryText: '',
      results: [],
      offset: 0,
      limit: 10,
      collapseBy: 'PBD',
      collapseType: 'DOCDB',
      collapseOrder: 'LATEST',
      field: 'PBDT_YEARMONTHDAY',
      order: 'DESC',
      totalSearchResults: 0,
      result_count: 0,
    };
  },
  computed: {
    ...mapState(['token', 'clientId']),
  },
  methods: {
    async searchPatents() {
      if (this.queryText.length > 15000) {
        alert('检索内容不能超过15000字符');
        return;
      }

      try {
        const response = await axios.post('/search', {
          token: this.token,
          clientId: this.clientId,
          offset: this.offset,
          limit: this.limit,
          queryText: this.queryText,
          collapseBy: this.collapseBy,
          collapseType: this.collapseType,
          collapseOrder: this.collapseOrder,
          field: this.field,
          order: this.order,
        });
        if (response.data.code === 67200003) {
          // token 过期
          alert(response.data.info);
          this.$router.push('/'); // 重新登录
          return;
        }
        if (response.data.code === 0) {
          const data = JSON.parse(response.data.data);
          this.results = data.data.results;
          this.totalSearchResults = data.data.total_search_result_count;
          this.result_count = data.data.result_count;
        } else {
          alert(response.data.info);
        }
      } catch (error) {
        console.error('查询失败:', error);
        alert('查询失败，请重试');
      }
    },
    changePage(direction) {
      this.offset += direction * this.limit;
      this.searchPatents();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

label {
  width: 150px;
  font-weight: bold;
}

.input-box {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.3s;
}

.input-box:focus {
  border-color: #007bff;
  outline: none;
}

.search-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0056b3;
}

.results {
  margin-top: 20px;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.results-table th,
.results-table td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.results-table th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}
</style>
