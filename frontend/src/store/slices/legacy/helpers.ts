/* 
  Automatically creates selectors for each states in store.
  Zustand recommends using selectors for calling state/actions for optimal performance
  Reference: https://docs.pmnd.rs/zustand/guides/auto-generating-selectors
*/
export const createSelectors = (_store: any) => {
    const store = _store
    store.use = {}
    for (const k of Object.keys(store.getState())) {
      store.use[k] = () => store((s: any) => s[k])
    }
  
    return store
  }
  