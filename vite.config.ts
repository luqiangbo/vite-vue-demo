import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'
import svgLoader from 'vite-svg-loader'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'
import { createHtmlPlugin } from 'vite-plugin-html'

const pathSrc = path.resolve(__dirname, 'src')

const getTarget = (mode, target) => {
  return loadEnv(mode, process.cwd())[target]
}

export default defineConfig(({ mode }) => {
  return {
    base: '/',
    resolve: {
      alias: {
        '@': pathSrc,
      },
    },
    server: {
      port: 3001,
    },
    plugins: [
      VueRouter({
        /* options */
        routesFolder: 'src/pages',
        extensions: ['.p.vue'],
      }),
      Layouts({
        layoutsDirs: 'src/layout',
        defaultLayout: 'index',
      }),
      vue(),
      svgLoader(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等  自动导入路由
        imports: ['vue', VueRouterAutoImports],
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: path.resolve(pathSrc, 'components.d.ts'),
      }),
      ElementPlus({}),
      createHtmlPlugin({
        inject: {
          data: {
            title: `美好口腔 [${getTarget(mode, 'VITE_APP_TITLE')}]`,
          },
        },
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          math: 'parens-division',
        },
      },
    },
    build: {
      minify: true,
      cssCodeSplit: false,
      sourcemap: false,
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            // 分包配置，配置完成自动按需加载
            vue: ['vue', 'vue-router', 'pinia', 'element-plus'],
          },
        },
      },
    },
  }
})
