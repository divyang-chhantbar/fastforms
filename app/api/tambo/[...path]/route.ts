import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const TAMBO_API_BASE = "https://api.tambo.co";

/**
 * Proxy handler to keep Tambo API Key safe on the server
 * and bypass CORS/Origin restrictions in production.
 */
async function handleProxy(req: NextRequest, { path }: { path: string[] }) {
  const apiKey = process.env.TAMBO_API_KEY || process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  
  if (!apiKey) {
    console.error("❌ Tambo Proxy: Missing API Key in ENV");
    return NextResponse.json({ error: "Missing Tambo API Configuration" }, { status: 500 });
  }

  const targetPath = path.join("/");
  const url = new URL(`${TAMBO_API_BASE}/${targetPath}`);
  
  // Forward all search params (like userKey)
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers();
  
  // Only forward safe/necessary headers
  const forwardHeaders = ["content-type", "accept", "authorization"];
  forwardHeaders.forEach(h => {
    const val = req.headers.get(h);
    if (val) headers.set(h, val);
  });

  // Inject the Secret Key
  headers.set("x-api-key", apiKey);

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.blob() : undefined,
    });

    // Handle Server-Sent Events (SSE) for streaming AI responses
    const contentType = response.headers.get("content-type");
    if (contentType?.includes("text/event-stream")) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    // Standard response (JSON, etc)
    const data = await response.blob();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": contentType || "application/json",
      },
    });
  } catch (error) {
    console.error("❌ Tambo Proxy Fatal Error:", error);
    return NextResponse.json({ error: "Tambo Service Communication Failed" }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleProxy(req, await params);
}
