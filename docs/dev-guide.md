Starting dev server

```
npm run dev
```

Building for production

```
npm run build
```

目录结构：

```
my-app/
├── public/                 # 静态资源，直接拷贝到 dist
│   └── favicon.ico
├── src/                    # 源码目录
│   ├── assets/             # 图片、字体、图标等
│   │   ├── images/
│   │   └── fonts/
│   ├── components/         # 复用组件（UI 组件）
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── button.module.css
│   │   │   └── index.ts
│   │   └── Modal/
│   │       ├── Modal.tsx
│   │       ├── modal.module.css
│   │       └── index.ts
│   ├── pages/              # 页面级组件
│   │   ├── Login/
│   │   │   ├── Login.tsx
│   │   │   └── login-page.module.css
│   │   └── Dashboard/
│   │       ├── Dashboard.tsx
│   │       └── dashboard-page.module.css
│   ├── hooks/              # 自定义 Hooks
│   │   └── useAuth.ts
│   ├── api/                # 后端请求封装
│   │   └── auth-api.ts
│   ├── services/           # 业务逻辑封装
│   │   └── auth-service.ts
│   ├── store/              # 状态管理（Zustand / Redux / Recoil）
│   │   └── user-store.ts
│   ├── utils/              # 工具函数
│   │   └── date-util.ts
│   ├── constants/          # 常量
│   │   └── app-constants.ts
│   ├── router/             # 路由配置
│   │   └── index.tsx
│   ├── styles/             # 全局样式
│   │   ├── reset.css
│   │   ├── variables.css
│   │   └── global.css
│   ├── App.tsx             # 根组件
│   └── main.tsx            # 入口
├── vite.config.ts          # Vite 配置
├── package.json
├── tsconfig.json           # TS 配置
├── .eslintrc.cjs
├── .prettierrc
└── README.md
```
