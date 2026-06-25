import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe' 
import { getUser } from '@/lib/core/SSR'

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    const body = await request.json();
    const { artworkId, title, price, imageUrl } = body;

    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: title,
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(price * 100), 
          },
          quantity: 1,
        },
      ],
      mode: 'payment', 
      metadata: {
        artworkId,
        userId: user?.id || user?._id
      },
      success_url: `${origin}/success/artwork?session_id={CHECKOUT_SESSION_ID}&artworkId=${artworkId}`,
      cancel_url: `${origin}/browse`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}