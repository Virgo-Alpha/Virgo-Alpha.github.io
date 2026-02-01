const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event, netlifyContext) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    let requestBody;
    try {
      requestBody = JSON.parse(event.body || "{}");
    } catch (parseError) {
      console.error("Invalid JSON in request body:", parseError.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON in request body" }),
      };
    }

    const { query, context: kbContext } = requestBody;

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server configuration error" }),
      };
    }

    if (!query || typeof query !== "string") {
      console.error("Invalid query received");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid query" }),
      };
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Keep it simple; do not use systemInstruction field (it errors on v1 payload)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const SYSTEM = `You are Bensonbot, an AI assistant for Benson Mugure's portfolio website.

RULES:
- Answer ONLY using the provided CONTEXT from Benson's portfolio.
- If the CONTEXT doesn't contain the answer, say so and suggest related topics you can help with.
- Be professional, concise, enthusiastic.
- Speak in first person as Benson.
- Do not invent facts.`;

    const prompt = kbContext && typeof kbContext === "string" && kbContext.trim().length > 0
      ? `${SYSTEM}

CONTEXT FROM BENSON'S PORTFOLIO:
${kbContext}

USER QUESTION:
${query}

Write the answer using ONLY the context above:`
      : `${SYSTEM}

No CONTEXT was provided.

USER QUESTION:
${query}

Explain you don't have enough portfolio excerpts to answer that, and suggest what you can answer (skills, projects, experience, certs).`;

    console.log(
      `Processing query: "${query.substring(0, 50)}${query.length > 50 ? "..." : ""}"`,
      `context length: ${kbContext ? kbContext.length : 0}`
    );

    const result = await model.generateContent(prompt);
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
      body: JSON.stringify({
        error: "Failed to generate response",
        details: error.message,
      }),
    };
  }
};
