import { debounce } from "lodash";
export const debouncedTriggerRefresh = (setRefreshTrigger) =>
  debounce(() => {
    setRefreshTrigger(prev => !prev);
  }, 300);
