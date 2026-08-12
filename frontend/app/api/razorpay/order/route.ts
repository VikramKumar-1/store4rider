import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount } = await req.json();

    const keyId = process.env.RAZORPAY_KEY_ID || "rzp_test_SxxPIU94rZKzyE";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "3Pp9pTZqJE8lfInmABu8az8k";

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: Math.round((amount || 1000) * 100), // convert to paise
        currency: "INR",
        receipt: `S4R_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error?.description || "Razorpay Order creation failed" }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
