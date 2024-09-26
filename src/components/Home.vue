<template>
  <div>
    <h1>专利查询</h1>
    <input
        type="text"
        v-model="queryText"
        placeholder="请输入检索内容（小于15000字符）"
    />
    <button @click="searchPatents">检索</button>

    <div v-if="results.length">
      <h2>检索结果</h2>
      <p>当前条数目： {{ result_count }} 条结果</p>
      <p>找到： {{ totalSearchResults }} 条结果</p>
      <ul>
        <li v-for="result in results" :key="result.patent_id">
          专利号: {{ result.pn }} (ID: {{ result.patent_id }})
        </li>
      </ul>
      <button @click="changePage(-1)" :disabled="offset === 0">上一页</button>
      <button @click="changePage(1)" :disabled="offset + pageSize >= totalSearchResults">下一页</button>
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
      pageSize: 10,
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
          queryText: this.queryText,
        });
        if (response.data.code === 67200003) {
            // token 过期
            alert(response.data.info)
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
      this.offset += direction * this.pageSize;
      this.searchPatents();
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}

input {
  margin-right: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
