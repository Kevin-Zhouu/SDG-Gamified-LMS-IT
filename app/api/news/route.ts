import { NextResponse } from "next/server";

export async function GET() {
  // Fetch news articles related to the Sustainable Development Goals
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=Sustainable+Development+Goals&sortBy=relevancy&language=en&apiKey=${process.env.NEWS_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  return NextResponse.json(data);
}
