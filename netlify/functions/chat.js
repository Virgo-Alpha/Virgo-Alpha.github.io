const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { query, context } = JSON.parse(event.body);

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are Bensonbot, an AI assistant for Benson Mugure's portfolio.
    Your goal is to help recruiters and visitors learn about Benson's skills, experience, and projects.
    
    Use the following context to answer the user's question.
    If the answer is not in the context, say "I don't have that information in my knowledge base, but I can tell you about Benson's web development skills or projects."
    
    Context:
    ${context}
    
    User Question: ${query}
    
    Answer as if you are Benson's helpful assistant. Be professional, concise, and enthusiastic.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: text }),
    };

  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate response" }),
    };
  }
};
