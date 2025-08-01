import { loadStripe, type Appearance } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "./App.css";
import CheckoutForm from "./CheckoutForm";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Success } from "./Success";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency: "EUR", amount: 320 }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  if (!clientSecret) {
    return <div>Loading payment form…</div>;
  }

  const appearance: Appearance = { theme: "stripe" };
  const options = { clientSecret, appearance, loader: "auto" as const };

  return (
    <Elements stripe={stripePromise} options={options}>
      <Router>
        <Routes>
          <Route path="/" element={<CheckoutForm />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </Router>
    </Elements>
  );
}

export default App;
