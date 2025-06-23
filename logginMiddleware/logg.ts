// logger.ts
export async function Log(stack: string, level: string, pkg: string, message: string) {
  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack,
        level,
        package: pkg,
        message
      })
    });

    if (!response.ok) {
      console.error("Failed to log message", response.statusText);
    }
  } catch (error) {
    console.error("Logging error:", error);
  }
}
