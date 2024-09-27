import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state() {
        return {
            token: localStorage.getItem('token') || null, // 从 LocalStorage 获取 token
            clientId: localStorage.getItem('clientId') || null, // 从 LocalStorage 获取 clientId

        };
    },
    mutations: {
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token); // 保存 token 到 LocalStorage
        },
        setClientId(state, clientId) {
            state.clientId = clientId;
            localStorage.setItem('clientId', clientId); // 保存 clientId 到 LocalStorage
        },
        clearAuthData(state) {
            state.token = null;
            state.clientId = null;
            localStorage.removeItem('token'); // 移除 token
            localStorage.removeItem('clientId'); // 移除 clientId
        },
    },
    actions: {
        async login({ commit }, account) {
            try {
                const response = await axios.post('/auth', account);
                if (response.data.code === 200) {
                    commit('setClientId', account.clientId);
                    commit('setToken', response.data.data);
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
        logout({ commit }) {
            commit('clearAuthData'); // 清除 token 和 clientId
        },
    },
});

export default store;
