import { createStore } from "vuex";

import { authentication } from "./authentication";
import { user } from "./user";

export default createStore({
  modules: {
    authentication,
    user,
  },
});
