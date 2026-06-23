import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export const PLAN_PRICE_ID={
    'user_pro':'price_1Tl4TOAZwbdTW7k2EzSAIGBM',
    'user_premium':'price_1Tl4UPAZwbdTW7k2DvgTlSLj'
}