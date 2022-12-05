import { defineConfig } from 'vite'
import defineOptions from 'unplugin-vue-define-options/vite'
import vue from '@vitejs/plugin-vue'
import jsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),defineOptions(),jsx()]
})
