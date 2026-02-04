
"use client";


import dynamic from "next/dynamic";


const CheckoutPage = dynamic(() => import("@/components/checkoutproccess/Checkout"), { ssr: false });

export default CheckoutPage;
