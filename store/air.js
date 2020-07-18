export const state = () => ({
    history: []
})
export const mutations = {
    addHistory(state, data) {
        state.history.unshift(data)
    }
}