import { serverApi } from "@/lib/axios-interceptor";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { orderId: string; documentType: string } }
) {
  try {
    const { orderId, documentType } = params;

    const response = await serverApi.get(
      `/order/${orderId}/print/${documentType}`,
      { responseType: "arraybuffer" }
    );

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${
          response.headers["content-disposition"] || "inline"
        }; filename="order-${orderId}-${documentType}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching print document:", error);
    return NextResponse.json(
      { error: "Failed to fetch print document" },
      { status: 500 }
    );
  }
}
