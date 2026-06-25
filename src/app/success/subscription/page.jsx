import { redirect } from "next/navigation";
import SuccessCard from "@/components/successCard";
import { stripe } from "@/lib/stripe";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export default async function SuccessPage({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  // Stripe সেশন ডেটা রিট্রিভ করা হচ্ছে
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  const status = session.status;
  const customerEmail = session.customer_details?.email;

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {
    // 🎯 ব্যাকএন্ডের নতুন ট্রানজেকশন প্যাটার্ন অনুযায়ী অবজেক্ট তৈরি
    const subInfo = {
      email: customerEmail,
      planId: session.metadata?.planId || "premium_plan", // Stripe ড্যাশবোর্ডে সেশন খোলার সময় metadata-তে planId পাস করতে হবে
      amount: session.amount_total ? session.amount_total / 100 : 29, // Stripe সেন্টে ভ্যালু দেয়, তাই ১০০ দিয়ে ভাগ করে ডলারে রূপান্তর
      paymentIntentId: session.payment_intent?.id || session.id, // পেমেন্ট আইডি অথবা সেশন আইডি
    };

    // ব্যাকএন্ড এপিআই-তে ডেটা পাঠানো হচ্ছে
    const result = await fetch(`${BASE_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subInfo),
    });

    const resData = await result.json();
    console.log("Subscription DB Sync Response:", resData);

    return (
      <div className="min-h-screen bg-[#111117] text-white flex flex-col items-center justify-center p-6">
        <SuccessCard customerEmail={customerEmail} sessionId={session_id} />
      </div>
    );
  }

  return null;
}