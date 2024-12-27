import { logging } from "../utils/logging";
import * as cheerio from 'cheerio';

export const web_request = {
  definition: {
    name: "web_request",
    description: "Make a GET request to a url.",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string", 
          description: "A portal to the internet. Use this when you need to get specific content from a website. Input should be a  url (i.e. https://www.google.com). The output will be the text response of the GET request."
        },
      },
      required: ["url"]
    }
  },

  implementation: async function (args: string) {
    const url = JSON.parse(args).url
  
    logging.log({ name: web_request.definition.name, url, args })
    const internetSearch = await fetch(url, {
      method: 'GET'
    })

    if (!internetSearch.ok) {
      logging.log({
        name: internet_search.definition.name,
        response: `${internetSearch.status} ${internetSearch.statusText}`
      })
      return 'function internet_search failed'
    }
    
    const text = await internetSearch.text()

    const $ = cheerio.load(text);
    $('script, style, meta, link, img, iframe, object, embed, video, audio').remove();
    $('nav, footer, header, aside').remove();
    const textContent = $('body').text();

    const maxSize = 512 * 1024; // 512 KB
    let cleanedContent = textContent;
    if (Buffer.byteLength(cleanedContent, 'utf-8') > maxSize) {
        cleanedContent = cleanedContent.substring(0, maxSize);
    }

    return cleanedContent;
  }
}


export const tavily_internet_search = {
  definition: {
    name: "tavily",
    description: "Get information on recent events from the web, tavily can both search and then read the found urls.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string", 
          description: "The search query to use. For example: 'Latest news on Nvidia stock performance'"
        },
      },
      required: ["query"]
    }
  },

  implementation: async function (args: string) {
    if (!process.env.TAVILY_API_KEY) throw new Error('TAVILY_API_KEY not found')
    const query = JSON.parse(args).query
  
    logging.log({ name: internet_search.definition.name, query, args })
    const internetSearch = await fetch(`https://api.tavily.com/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
      }),
    })

    if (!internetSearch.ok) {
      logging.log({
        name: internet_search.definition.name,
        response: `${internetSearch.status} ${internetSearch.statusText}`
      })
      return 'function internet_search failed'
    }
    
    const text = await internetSearch.text()
    return text
  }
}

export const serper_internet_search = {
  definition: {
    name: "serper",
    description: "Get results from google.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string", 
          description: "The search query to use. For example: 'Latest news on Nvidia stock performance'"
        },
      },
      required: ["query"]
    }
  },

  implementation: async function ({ args }: { args: string }) {
    const h = new Headers();
    if (!process.env.SERPER_API_KEY) throw new Error('SERPER_API_KEY not found')
    h.append("X-API-KEY", process.env.SERPER_API_KEY);
    h.append("Content-Type", "application/json");
    
    const q = JSON.parse(args).query
    const raw = JSON.stringify({ q, tbs: "qdr:w" });
    
    logging.log({
      name: internet_search.definition.name,
      raw
    })

    const internetSearch = await fetch("https://google.serper.dev/search", {
      method: 'POST',
      headers: h,
      body: raw,
      redirect: 'follow'
    })
    
    if (!internetSearch.ok) {
      logging.log({
        name: internet_search.definition.name,
        response: `${internetSearch.status} ${internetSearch.statusText}`
      })
      return 'function internet_search failed'
    }
    
    const text = await internetSearch.text()
    return text
  }
}

export const internet_search = tavily_internet_search

export const tools = [tavily_internet_search, web_request]