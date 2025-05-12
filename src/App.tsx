import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { ASK_OPENAI } from './graphql/queries';
import './styles/App.css';

interface OpenAIResponse {
    text: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    metadata: {
        model: string;
        finishReason: string;
    };
}

interface QueryResult {
    askOpenAI: OpenAIResponse;
}

const App: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [model, setModel] = useState('gpt-3.5-turbo'); // 默认模型
    const [conversations, setConversations] = useState<Array<{ prompt: string, response: OpenAIResponse | null }>>([]);
    const [isScrolled, setIsScrolled] = useState(false);

    const [getOpenAIResponse, { loading, error }] = useLazyQuery<QueryResult>(ASK_OPENAI, {
        onCompleted: (data) => {
            const newConversation = {
                prompt,
                response: data.askOpenAI
            };
            setConversations([...conversations, newConversation]);
            setPrompt('');
            // 滚动到最新的回答
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    });

    // 滚动监听，用于显示/隐藏"返回顶部"按钮
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        getOpenAIResponse({
            variables: {
                prompt: prompt.trim(),
                model
            }
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 调整textarea高度以适应内容
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 300)}px`;
    };

    return (
        <div className="container">
            <header className="header">
                <h1>OpenAI GraphQL 客户端</h1>
                <p>通过Cloudflare Workers GraphQL API查询OpenAI</p>
            </header>

            <div className="model-selector">
                <label htmlFor="model-select">选择模型：</label>
                <select
                    id="model-select"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo</option>
                </select>
            </div>

            <form className="prompt-form" onSubmit={handleSubmit}>
                <textarea
                    value={prompt}
                    onChange={handleTextareaChange}
                    placeholder="输入你的问题..."
                    rows={3}
                    disabled={loading}
                />
                <button type="submit" disabled={loading || !prompt.trim()}>
                    {loading ? '请求中...' : '发送请求'}
                    {loading && <span className="loading"></span>}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    <p>请求出错：{error.message}</p>
                </div>
            )}

            <div className="conversations">
                {conversations.map((conv, index) => (
                    <div key={index} className="conversation-item">
                        <div className="prompt-container">
                            <strong>问题：</strong>
                            <p>{conv.prompt}</p>
                        </div>
                        <div className="response-container">
                            <strong>回答：</strong>
                            {conv.response ? (
                                <>
                                    <div className="response-content">
                                        <ReactMarkdown>{conv.response.text}</ReactMarkdown>
                                    </div>
                                    <div className="response-metadata">
                                        <span>模型：{conv.response.metadata.model}</span>
                                        <span>标记数：{conv.response.usage.totalTokens}</span>
                                    </div>
                                </>
                            ) : (
                                <p>加载中...</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isScrolled && (
                <button onClick={scrollToTop} className="back-to-top" aria-label="返回顶部">
                    <i className="fas fa-arrow-up"></i>
                </button>
            )}
        </div>
    );
};

export default App; 