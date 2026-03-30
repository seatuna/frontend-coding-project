import { http, HttpResponse } from 'msw'
import { StreamEvent } from '../types'

const mockFoodStreamData: StreamEvent[] = [
  { type: "status", message: "Processing your question about kimchi fermentation..." },
  { type: "text", content: "I'd be happy to help you make authentic " },
  { type: "text", content: "homemade kimchi! Let me look up the traditional " },
  { type: "text", content: "fermentation process for you.\n\n" },
  { type: "tool_start", tool: "search_fermentation_guides" },
  { type: "tool_result", tool: "search_fermentation_guides", result: "Found 5 traditional Korean kimchi recipes and fermentation guides" },
  { type: "text", content: "## Traditional Napa Cabbage Kimchi (Baechu Kimchi)\n\n" },
  { type: "text", content: "**Ingredients:**\n" },
  { type: "text", content: "- 1 large napa cabbage (about 2kg)\n" },
  { type: "text", content: "- 1/2 cup coarse sea salt\n" },
  { type: "text", content: "- 1 tablespoon grated ginger\n" },
  { type: "text", content: "- 6 cloves garlic, minced\n" },
  { type: "text", content: "- 1 tablespoon fish sauce\n" },
  { type: "text", content: "- 2 tablespoons gochugaru (Korean red pepper flakes)\n" },
  { type: "text", content: "- 4 scallions, chopped\n" },
  { type: "text", content: "- 1 medium daikon radish, julienned\n\n" },
  { type: "text", content: "**Instructions:**\n\n" },
  { type: "text", content: "1. Cut the cabbage lengthwise into quarters and remove " },
  { type: "text", content: "the core. Chop into 2-inch pieces.\n\n" },
  { type: "text", content: "2. Dissolve the salt in water and soak the cabbage for " },
  { type: "text", content: "2 hours, turning every 30 minutes. Rinse thoroughly " },
  { type: "text", content: "3 times and drain well.\n\n" },
  { type: "text", content: "3. Make the paste: Mix gochugaru, garlic, ginger, and " },
  { type: "text", content: "fish sauce into a thick paste.\n\n" },
  { type: "text", content: "4. In a large bowl, massage the paste into the cabbage, " },
  { type: "text", content: "radish, and scallions until everything is evenly coated.\n\n" },
  { type: "text", content: "5. **The fermentation process:** Pack the kimchi tightly " },
  { type: "text", content: "into clean glass jars, leaving 1 inch of headspace. " },
  { type: "text", content: "Press down to remove air bubbles. Seal and let ferment " },
  { type: "text", content: "at room temperature for 1-5 days.\n\n" },
  { type: "citation", title: "Traditional Kimchi Fermentation Guide - Korean Food Institute", url: "https://koreanfood.example/kimchi-guide" },
  { type: "text", content: "**Fermentation Tips:**\n" },
  { type: "text", content: "- Taste daily starting on day 2. When it reaches your " },
  { type: "text", content: "preferred tanginess, move to the refrigerator.\n" },
  { type: "text", content: "- Burp the jars daily to release CO2 buildup.\n" },
  { type: "text", content: "- The longer it ferments, the more complex and sour " },
  { type: "text", content: "the flavor becomes.\n" },
  { type: "text", content: "- Properly fermented kimchi can last 3-6 months refrigerated.\n\n" },
  { type: "citation", title: "The Science of Lacto-Fermentation - Food Science Journal", url: "https://foodscience.example/fermentation" },
  { type: "text", content: "Enjoy your homemade probiotic-rich kimchi!" },
  { type: "done" }
];

export const handlers = [
  http.post('https://api.example.com/chat', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const event of mockFoodStreamData) {
          // mock random 0 - 500ms delay
          await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

          const data = `data: ${JSON.stringify(event)}\n\n`;
          controller.enqueue(encoder.encode(data));
        }
        controller.close();
      }
    });

    return new HttpResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }),
]