import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state() {
        return {
            token: null,
            clientId: null, // 添加 clientId 状态
        };
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
        },
        setClientId(state, clientId) { // 添加 setClientId mutation
            state.clientId = clientId;
        },
    },
    actions: {
        async login({ commit }, account) {
            try {
                const response = await axios.post('/auth', account);
                if (response.data.code === 200) {
                    commit('setToken', response.data.data);
                    commit('setClientId', account.clientId); // 存储 clientId
                    return true;
                } else {
                    alert(response.data.info);
                    return false;
                }
            } catch (error) {
                console.error('登录失败:', error);
                return false;
            }
        },
    },
});

export default store;
