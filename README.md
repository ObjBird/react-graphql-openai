# React OpenAI GraphQL 客户端

这是一个使用React、TypeScript和Apollo Client构建的客户端应用，用于通过Cloudflare Workers部署的GraphQL API请求OpenAI服务。

## 功能

- 向OpenAI发送请求并显示响应
- 支持多种OpenAI模型选择
- 展示令牌使用情况和模型信息
- 支持Markdown渲染

## 技术栈

- React 18
- TypeScript
- Apollo Client (GraphQL)
- Webpack 5
- React Markdown

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置

在 `src/graphql/client.ts` 文件中，将 `GRAPHQL_ENDPOINT` 修改为你的Cloudflare Workers GraphQL API端点。

```typescript
const GRAPHQL_ENDPOINT = 'https://your-workers-domain.workers.dev/graphql';
```

### 开发

```bash
npm start
```

应用将在 http://localhost:3000 上运行。

### 构建生产版本

```bash
npm run build
```

生产代码将生成在 `dist` 目录中。

## GraphQL Schema

这个客户端期望Workers GraphQL API提供以下查询：

```graphql
type OpenAIResponse {
  text: String!
  usage: OpenAIUsage!
  metadata: OpenAIMetadata!
}

type OpenAIUsage {
  promptTokens: Int!
  completionTokens: Int!
  totalTokens: Int!
}

type OpenAIMetadata {
  model: String!
  finishReason: String
}

type Query {
  askOpenAI(prompt: String!, model: String): OpenAIResponse!
}
```

## 部署

构建生产版本后，可以将 `dist` 目录的内容部署到任何静态网站托管服务，如Netlify、Vercel、GitHub Pages等。 