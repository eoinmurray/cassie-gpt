import "cheerio"; // This is required in notebooks to use the `CheerioWebBaseLoader`
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { createRetrieverTool } from "langchain/tools/retriever";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
// import { AIMessage, HumanMessage } from "@langchain/core/messages";

const search = new TavilySearchResults({maxResults: 2,apiKey: process.env.TAVILY_API_KEY });
const model = new ChatOpenAI({ model: "gpt-4", apiKey: process.env.TEST_OPENAI_API_KEY });
const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.TEST_OPENAI_API_KEY })
const loader = new CheerioWebBaseLoader("https://docs.smith.langchain.com/overview");
const docs = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000,chunkOverlap: 200 });
const documents = await splitter.splitDocuments(docs);
const vectorStore = await MemoryVectorStore.fromDocuments(documents,embeddings);
const retriever = vectorStore.asRetriever();
const retrieverTool = await createRetrieverTool(retriever, {name: "langsmith_search",description:"Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",});
const tools = [search, retrieverTool];
// const modelWithTools = model.bindTools(tools);
// const response = await modelWithTools.invoke([new HumanMessage("What's the weather in SF?"),]);
// console.log(`Content: ${response.content}`);
// console.log(`Tool calls: ${JSON.stringify(response.tool_calls, null, 2)}`);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant"],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

const agent = await createToolCallingAgent({ llm: model, tools, prompt });
const agentExecutor = new AgentExecutor({agent,tools,});

const store: { [key: string]: BaseChatMessageHistory } = {};
function getMessageHistory(sessionId: string): BaseChatMessageHistory {
  if (!(sessionId in store)) {
    store[sessionId] = new ChatMessageHistory();
  }
  return store[sessionId]!;
}

const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

await agentWithChatHistory.invoke(
  { input: "hi! I'm bob" },
  { configurable: { sessionId: "<foo>" } }
);

console.log(
  await agentWithChatHistory.invoke(
    { input: "what's my name?" },
    { configurable: { sessionId: "<foo>" } }
  )
)