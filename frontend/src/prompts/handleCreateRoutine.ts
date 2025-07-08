export async function handleCreateRoutine(selected : any, selectedSub: any, selectedTime: any) {
  const prompt = `Create a detailed ${selectedTime} music practice routine for ${selected} practice focused on ${selectedSub}. Include warm-up, main exercises, and cool-down with specific instructions.`;

  const requestPayload = {
    model: "undefined",  // this gets changed to gemini model
    messages: [
      {
        role: "system",
        content:
          "You are a helpful guitar teacher and practice routine creator.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    stream: false,
  };

  try {
    const res = await fetch("http://127.0.0.1:8000/generate_routine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    });

    if (res.ok) {
      const data = await res.json();
      return data.routine;
    } else {
      const errorData = await res.json();
      console.error("Error:", errorData.detail);
      alert("Failed to generate routine: " + errorData.detail);
    }
  } catch (error) {
    console.error("Request failed:", error);
    alert("An error occurred while generating the routine.");
  }
}
