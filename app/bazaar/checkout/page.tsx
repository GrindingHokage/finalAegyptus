"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart/cart-context"
import { ArrowLeft, CreditCard, Landmark, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingMethod, setShippingMethod] = useState("standard")

  // Calculate costs
  const shippingCost = shippingMethod === "express" ? 20 : 10
  const taxCost = subtotal * 0.07
  const totalCost = subtotal + shippingCost + taxCost

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    clearCart()
    router.push("/bazaar/order-confirmation")
    setLoading(false)
  }

  if (items.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold text-gold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6 text-center">
          Add some items to your cart before proceeding to checkout
        </p>
        <Link href="/bazaar">
          <Button className="bg-gold hover:bg-gold/90 text-black">Return to Bazaar</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center">
        <Link href="/bazaar" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gold font-cinzel">Checkout</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gold" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" className="border-gold/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" className="border-gold/20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" className="border-gold/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St" className="border-gold/20" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Cairo" className="border-gold/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" placeholder="12345" className="border-gold/20" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Egypt" className="border-gold/20" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+20 123 456 7890" className="border-gold/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Truck className="h-5 w-5 mr-2 text-gold" />
                Shipping Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="space-y-3">
                <div className="flex items-center space-x-3 border border-gold/20 rounded-md p-3 cursor-pointer hover:border-gold/50">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="font-medium">Standard Shipping</div>
                    <div className="text-sm text-muted-foreground">Delivery in 5-7 business days</div>
                  </Label>
                  <div className="font-medium">$10.00</div>
                </div>

                <div className="flex items-center space-x-3 border border-gold/20 rounded-md p-3 cursor-pointer hover:border-gold/50">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="font-medium">Express Shipping</div>
                    <div className="text-sm text-muted-foreground">Delivery in 2-3 business days</div>
                  </Label>
                  <div className="font-medium">$20.00</div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gold" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" onValueChange={setPaymentMethod} value={paymentMethod}>
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Doe" className="border-gold/20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="border-gold/20" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" className="border-gold/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" className="border-gold/20" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex items-center mb-2">
                      <Landmark className="h-5 w-5 mr-2 text-gold" />
                      <h3 className="font-medium">Bank Transfer Details</h3>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Bank Name:</span> Egyptian National Bank
                      </p>
                      <p>
                        <span className="text-muted-foreground">Account Name:</span> AEGYPTUS Bazaar
                      </p>
                      <p>
                        <span className="text-muted-foreground">Account Number:</span> 1234567890
                      </p>
                      <p>
                        <span className="text-muted-foreground">IBAN:</span> EG123456789012345678901234
                      </p>
                      <p>
                        <span className="text-muted-foreground">Reference:</span> Your email address
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Please make the transfer and provide your transaction details below.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input id="transactionId" placeholder="TRX123456789" className="border-gold/20" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden bg-accent shrink-0 relative">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${item.price.toFixed(2)} × {item.quantity}
                        </span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-gold/20" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span>${taxCost.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="bg-gold/20" />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-gold">${totalCost.toFixed(2)}</span>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full bg-gold hover:bg-gold/90 text-black"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Place Order"}
                </Button>

                <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Secure checkout powered by AEGYPTUS
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gold/20">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                If you have any questions about your order, please contact our customer support.
              </p>
              <Button variant="outline" className="w-full border-gold/20">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
