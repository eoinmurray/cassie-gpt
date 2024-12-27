import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { OpenAIAssistantRunnable } from "langchain/experimental/openai_assistant";
import { AgentExecutor } from "langchain/agents";
import { OpenAIFiles } from "langchain/experimental/openai_files";
import getFixture from "@/tests/utils/get-fixture";

if (!process.env.TEST_OPENAI_API_KEY) throw new Error("Missing OpenAI API key");
if (!process.env.TEST_ASSISTANT_ID) throw new Error("Missing OpenAI Assistant ID");
if (!process.env.TAVILY_API_KEY) throw new Error("Missing Tavily API key");

const searchTool = new TavilySearchResults({ apiKey: process.env.TAVILY_API_KEY });
const tools = [searchTool];

const assistant = new OpenAIAssistantRunnable({
  clientOptions: { apiKey: process.env.TEST_OPENAI_API_KEY },
  assistantId: process.env.TEST_ASSISTANT_ID,
});

await assistant.modifyAssistant({
  fileIds: ['file-UQTRJb4dCSGdN6GMNPEuQuts']
});

const agentExecutor = AgentExecutor.fromAgentAndTools({
  agent: assistant,
  tools,
});

const assistantResponse = await agentExecutor.invoke({
  content: "whats in file.txt",
});
console.log(assistantResponse);
