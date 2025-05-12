import { gql } from '@apollo/client';

// 示例查询：向OpenAI发送请求的GraphQL查询
export const ASK_OPENAI = gql`
  query AskOpenAI($prompt: String!, $model: String) {
    askOpenAI(prompt: $prompt, model: $model) {
      text
      usage {
        promptTokens
        completionTokens
        totalTokens
      }
      metadata {
        model
        finishReason
      }
    }
  }
`;

// 你可以添加更多查询，例如获取可用模型等 