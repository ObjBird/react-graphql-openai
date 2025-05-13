import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// 这里替换为你的Cloudflare Workers GraphQL端点
const GRAPHQL_ENDPOINT = 'https://api.longdi.xyz/graphql';

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL 错误]: 消息: ${message}, 位置: ${locations}, 路径: ${path}`
            )
        );

    if (networkError)
        console.error(`[网络错误]: ${networkError}`);
});

const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    credentials: 'same-origin'
});

const client = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
        },
    },
    connectToDevTools: true
});

export default client; 