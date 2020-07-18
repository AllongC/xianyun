export const state = () => ({
    history: []
})
export const mutations = {
    addHistory(state, data) {
        if (state.history.length >= 5) {
            state.history.pop()
        }
        state.history.unshift(data)
    }
}