export async function getMatchScoreFromAI(resumeText, jobDescription) {
  const apiKey = process.env.GROQ_API_KEY; // المفتاح الجديد

  const cleanResume = resumeText.replace(/\s+/g, " ").slice(0, 6000);

  const prompt = {
    model: "llama-3.3-70b-versatile", // موديل قوي جداً ومجاني
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
    console.log("--- ⚡ Sending to Groq (Llama 3) ---");

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
    console.log("--- ✅ Groq Response Success ---");
    return JSON.parse(content);
  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    return {
      score: 0,
      reason: "Analys misslyckades. Försök igen.",
    };
  }
}
