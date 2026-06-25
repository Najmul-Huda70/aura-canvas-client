import { redirect } from "next/navigation";
import SuccessCard from "@/components/successCard";
import { stripe } from "@/lib/stripe";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;
export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const status = session.status;
  const customerEmail = session.customer_details?.email;
  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    const subInfo = {
      email: customerEmail,
      planId: session.metadata?.planId,
    };
    const result = await fetch(`${BASE_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subInfo),
    });

    const resData = await result.json();
    console.log(resData);
    return (
      <div className="min-h-screen bg-[#111117] text-white flex flex-col items-center justify-center p-6">
        <SuccessCard customerEmail={customerEmail} sessionId={session_id} />
      </div>
    );
  }

  return null;
}
