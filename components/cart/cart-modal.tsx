"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "./cart-context"

interface CartModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCart()
  const router = useRouter()

  // Calculate costs
  const shippingCost = subtotal >= 100 ? 0 : 10
  const taxCost = subtotal * 0.07
  const totalCost = subtotal + shippingCost + taxCost

  const handleCheckout = () => {
    onOpenChange(false)
    router.push("/bazaar/checkout")
  }

  const handleContinueShopping = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg bg-background/95 backdrop-blur-sm border-l border-gold/20">
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <SheetHeader className="border-b border-gold/20 pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-gold" />
                <span className="text-gold">Your Cart ({items.length} items)</span>
              </SheetTitle>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCart}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  Clear Cart
                </Button>
              )}
            </div>
          </SheetHeader>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Add some items to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-card/50 rounded-lg border border-gold/10 hover:border-gold/20 transition-colors"
                  >
                    <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0 border border-gold/10">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate mb-1">{item.name}</h3>
                      <p className="text-gold font-semibold text-sm">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-gold/20 hover:border-gold/40 hover:bg-gold/5"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-gold/20 hover:border-gold/40 hover:bg-gold/5"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                      <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="border-t border-gold/20 pt-4 space-y-4">
              {/* Cart Summary */}
              <div className="space-y-2 text-sm bg-card/30 p-3 rounded-lg border border-gold/10">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span className="font-medium">${taxCost.toFixed(2)}</span>
                </div>
                <Separator className="my-2 bg-gold/20" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-gold text-lg">${totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-3 text-base"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gold/20 hover:border-gold/40 hover:bg-gold/5"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
