import { NextRequest, NextResponse } from "next/server"

// Fallback SEO generator when AI API is unavailable
function generateFallbackSEO(productName: string, productDescription: string) {
  // Extract first 160 chars from description (removing HTML tags if any)
  const cleanDescription = productDescription.replace(/<[^>]*>/g, '').trim()
  const shortDescription = cleanDescription.substring(0, 157) + "..."
  
  // Generate keywords from product name and description
  const words = (productName + " " + cleanDescription)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3)
  
  const uniqueWords = [...new Set(words)].slice(0, 10)
  const keywords = [...uniqueWords, "grooming", "men's care", "alpha grooming"].join(", ")
  
  return {
    metaTitle: `${productName} | Alpha Grooming`,
    metaDescription: shortDescription,
    metaKeywords: keywords
  }
}

export async function POST(request: NextRequest) {
  let productName = ""
  let productDescription = ""
  
  try {
    console.log("=== SEO Generation API Called ===")
    
    const body = await request.json()
    productName = body.productName
    productDescription = body.productDescription
    
    console.log("Request data:", { 
      productName, 
      descriptionLength: productDescription?.length 
    })

    if (!productName || !productDescription) {
      console.error("Missing required fields")
      return NextResponse.json(
        { error: "Product name and description are required" },
        { status: 400 }
      )
    }

    const apiKey = process.env.DO_AI_API_KEY
    console.log("API Key present:", !!apiKey, "Length:", apiKey?.length)
    
    if (!apiKey) {
      console.warn("AI API key not configured - using fallback SEO generator")
      const fallbackSEO = generateFallbackSEO(productName, productDescription)
      return NextResponse.json(fallbackSEO)
    }

    const url = "https://inference.do-ai.run/v1/chat/completions"
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    }

    const prompt = `You are an SEO expert for an e-commerce grooming products website called Alpha Grooming.

Product Name: ${productName}
Product Description: ${productDescription}

Generate SEO metadata in JSON format with exactly these fields:
- metaTitle: A compelling, SEO-optimized title (maximum 60 characters)
- metaDescription: An engaging meta description (maximum 160 characters)
- metaKeywords: Comma-separated relevant keywords (8-12 keywords)

Return ONLY valid JSON, no other text. Example format:
{
  "metaTitle": "Premium Beard Oil | Alpha Grooming",
  "metaDescription": "Discover our premium beard oil for soft, healthy beards. Natural ingredients, fast absorption. Shop Alpha Grooming today!",
  "metaKeywords": "beard oil, grooming, men's care, beard care, natural beard oil, premium grooming, alpha grooming, facial hair care"
}`

    const data = {
      model: "openai-gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    }

    console.log("Calling AI API with prompt length:", prompt.length)
    
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("AI API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      
      // Use fallback on AI API error
      console.warn("AI API failed - using fallback SEO generator")
      const fallbackSEO = generateFallbackSEO(productName, productDescription)
      return NextResponse.json(fallbackSEO)
    }

    const aiResponse = await response.json()
    console.log("AI Response received:", {
      hasChoices: !!aiResponse.choices,
      choicesLength: aiResponse.choices?.length,
      hasContent: !!aiResponse.choices?.[0]?.message?.content
    })
    
    const generatedContent = aiResponse.choices?.[0]?.message?.content

    if (!generatedContent) {
      console.error("No content in AI response:", aiResponse)
      console.warn("Using fallback SEO generator")
      const fallbackSEO = generateFallbackSEO(productName, productDescription)
      return NextResponse.json(fallbackSEO)
    }

    console.log("Generated content:", generatedContent.substring(0, 200))

    // Parse the JSON response from AI
    try {
      const seoData = JSON.parse(generatedContent.trim())
      console.log("Successfully parsed SEO data:", seoData)
      return NextResponse.json(seoData)
    } catch (parseError) {
      // If JSON parsing fails, try to extract data from text
      console.error("JSON parse error:", parseError)
      console.error("Raw content:", generatedContent)
      console.warn("Using fallback SEO generator")
      const fallbackSEO = generateFallbackSEO(productName, productDescription)
      return NextResponse.json(fallbackSEO)
    }
  } catch (error: any) {
    console.error("SEO generation error:", error.message, error.stack)
    
    // Use fallback on any error
    if (productName && productDescription) {
      console.warn("Using fallback SEO generator due to error")
      const fallbackSEO = generateFallbackSEO(productName, productDescription)
      return NextResponse.json(fallbackSEO)
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
