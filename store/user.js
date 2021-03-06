export const state = () => ({
    userInfo: ''
})
export const mutations = {
    setUserInfo(state, userInfo) {
        state.userInfo = userInfo
    }
}
export const actions = {
    login({ commit }, form) {
        return this.$axios({
            url: "/accounts/login",
            method: "post",
            data: form
        }).then(res => {
            const { data } = res;
            commit("setUserInfo", data);
            return res
        });
    },
    register({ commit }, data) {
        return this.$axios({
            url: "/accounts/register",
            method: "post",
            data
        }).then(res => {
            const { data } = res;
            commit("setUserInfo", data);
            return res;
        });
    }
}
