
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      throw new Error("API key not found");
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request format. 'messages' array is required." }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add educational system prompt
    const systemMessages = [{
      role: "system", 
      content: "You are an educational assistant that helps students understand concepts, write better papers, and avoid plagiarism. You provide detailed explanations and academic guidance, but you do not write papers for students. Your goal is to teach proper citation methods, help improve writing skills, and explain complex topics in an accessible way."
    }];
    
    const allMessages = [...systemMessages, ...messages];
    
    console.log("Sending request to OpenAI with messages:", JSON.stringify(allMessages));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: allMessages,
        temperature: 0.7,
      }),
    });

    const responseData = await response.json();
    
    if (responseData.error) {
      console.error("OpenAI API error:", responseData.error);
      throw new Error(responseData.error.message || "Error from OpenAI API");
    }

    return new Response(JSON.stringify({
      message: responseData.choices[0].message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in educational-ai function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
