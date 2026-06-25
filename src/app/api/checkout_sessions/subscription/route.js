import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe'
import { PLAN_PRICE_ID } from '@/lib/stripe'
import { getUser } from '@/lib/core/SSR'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const formData= await request.formData();
    // console.log("Your formData is:", formData);
    const planId=formData.get('plan_id');
    
    const priceId=PLAN_PRICE_ID[planId];
    // console.log('price plan id: ',priceId);
    const user= await getUser();
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
    customer_email: user?.email,
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata:{planId},
      success_url: `${origin}/success/subscription?session_id={CHECKOUT_SESSION_ID}`,
    });
    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}