const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // Parse and validate request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { query, context } = requestBody;

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    // Validate inputs
    if (!query || typeof query !== 'string') {
      console.error("Invalid query received");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid query" }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct a properly formatted prompt with clear sections
    const systemInstruction = `You are Bensonbot, an AI assistant for Benson Mugure's portfolio website. Your goal is to help recruiters and visitors learn about Benson's skills, experience, and projects.

INSTRUCTIONS:
- Answer questions based ONLY on the provided context from Benson's portfolio
- Be professional, concise, and enthusiastic
- If the context doesn't contain the answer, politely say so and suggest related topics you can help with
- Speak in first person as if you're representing Benson
- Keep responses focused and relevant to the question asked`;

    let prompt;
    if (context && context.trim().length > 0) {
      prompt = `${systemInstruction}

CONTEXT FROM BENSON'S PORTFOLIO:
${context}

USER QUESTION: ${query}

Please provide a helpful, accurate answer based on the context above:`;
    } else {
      prompt = `${systemInstruction}

USER QUESTION: ${query}

Note: No specific context was found for this query. Please provide a general helpful response about what topics you can help with regarding Benson's portfolio (skills, projects, experience, certifications, etc.):`;
    }

    console.log(`Processing query: "${query}" with context length: ${context ? context.length : 0}`);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`Generated response length: ${text.length}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ answer: text }),
    };

  } catch (error) {
    console.error("Error generating content:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate response", details: error.message }),
    };
  }
};
