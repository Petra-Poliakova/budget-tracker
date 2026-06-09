import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
})


//https://github.com/bvaughn/react-window/tree/main
//https://github.com/testing-library/react-testing-library/tree/main
//https://github.com/avithe1/vite_react_ts_rtl_vitest/tree/master
//https://github.com/alexhddev/React-testing-course