import { serverApi } from "@/lib/axios-interceptor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await serverApi.get("/auth/self");
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching self auth:", error);
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      // Handle unauthorized access, e.g., redirect to login
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
