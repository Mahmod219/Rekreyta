"use server";

export async function getMatchScoreFromAI(resumeText, jobDescription) {
  const apiKey = process.env.GROQ_API_KEY;

  const cleanResume = resumeText.replace(/\s+/g, " ").slice(0, 6000);

  const prompt = {
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: "Du är en rekryteringsexpert. Svara endast med JSON.",
      },
      {
        role: "user",
        content: `Analysera CV mot jobbannons. 
        Jobb: "${jobDescription.slice(0, 2000)}"
        CV: "${cleanResume}"
        Returnera format: {"score": number, "reason": "motivering på svenska"}`,
      },
    ],
    response_format: { type: "json_object" },
  };

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prompt),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Groq Error");
    }

    const content = data.choices[0].message.content;

    return JSON.parse(content);
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    return {
      score: 0,
      reason: "Analys misslyckades. Försök igen.",
    };
  }
}

export async function generateEmbedding(text) {
  try {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // تأكد من اسم المتغير
      },
      body: JSON.stringify({
        input: text,
        model: "text-embedding-3-small",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error Details:", result); // هذا سيخبرك بالسبب الحقيقي (مثل رصيد منتهي أو نص طويل)
      return null;
    }

    if (result.data && result.data.length > 0) {
      return result.data[0].embedding;
    }

    return null;
  } catch (err) {
    console.error("Fetch Exception:", err.message);
    return null;
  }
}
