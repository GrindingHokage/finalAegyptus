"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ShoppingCart, Search, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/components/cart/cart-context"
import { CartModal } from "@/components/cart/cart-modal"

// Detailed products data
const products = [
  {
    id: 1,
    name: "Gold Scarab Pendant",
    price: 129.99,
    image: "https://huntersfinejewellery.com/cdn/shop/articles/ruby-scarab-pendant.jpg?v=1728505386&width=1500",
    category: "jewelry",
    rating: 4.8,
    description:
      "This exquisite gold scarab pendant is inspired by ancient Egyptian symbolism. The scarab beetle was considered sacred in ancient Egypt, representing rebirth and regeneration.",
    stock: 12,
  },
  {
    id: 2,
    name: "Handcrafted Papyrus Art",
    price: 49.99,
    image: "https://m.media-amazon.com/images/I/91sZav3ZXmL._AC_UF894,1000_QL80_.jpg",
    category: "papyrus",
    rating: 4.5,
    description:
      "This authentic handcrafted papyrus art piece showcases traditional Egyptian scenes painted by skilled local artists.",
    stock: 8,
  },
  {
    id: 3,
    name: "Alabaster Canopic Jar",
    price: 199.99,
    image: "https://m.media-amazon.com/images/I/71eQEAivRPL._AC_SX679_.jpg",
    category: "sculpture",
    rating: 4.9,
    description:
      "This exquisite alabaster canopic jar is a faithful reproduction of those used in ancient Egyptian mummification rituals.",
    stock: 5,
  },
  {
    id: 4,
    name: "Ankh Symbol Necklace",
    price: 79.99,
    image:
      "https://wootandhammy.com/cdn/shop/products/large-ankh-with-horus-eye-and-hieroglyphs-oxidized-pendant-dp-1563-1165-3.jpg?v=1678315139",
    category: "jewelry",
    rating: 4.7,
    description:
      "The Ankh, also known as the key of life, is an ancient Egyptian hieroglyphic symbol representing life itself.",
    stock: 15,
  },
  {
    id: 5,
    name: "Handmade Egyptian Carpet",
    price: 299.99,
    image: "https://i.ebayimg.com/images/g/Q8MAAOSwCyRlWZZC/s-l1600.webp",
    category: "home",
    rating: 4.6,
    description:
      "This luxurious handmade Egyptian carpet features traditional patterns inspired by ancient Egyptian motifs and hieroglyphs.",
    stock: 3,
  },
  {
    id: 6,
    name: "Bastet Cat Figurine",
    price: 59.99,
    image: "https://m.media-amazon.com/images/I/81knjtWP+iL._AC_SX679_.jpg",
    category: "sculpture",
    rating: 4.4,
    description:
      "This elegant Bastet cat figurine is inspired by the ancient Egyptian goddess of home, fertility, and protection.",
    stock: 20,
  },
]

export default function BazaarPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem, itemCount } = useCart()

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  // Cart functions
  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="container py-8 px-4">
      {/* Header with Search and Cart */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-cinzel text-3xl font-bold text-gold">Bazaar</h1>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gold/20 focus-visible:ring-gold"
            />
          </div>

          {/* Enhanced Cart Icon */}
          <Button
            variant="outline"
            className="relative border-gold/20 hover:border-gold/50"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gold text-black text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Product Grid with Filters */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
            <TabsTrigger value="papyrus">Papyrus</TabsTrigger>
            <TabsTrigger value="sculpture">Sculpture</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <TabsContent value={selectedCategory} className="mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Cart Modal */}
      <CartModal open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}

function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="border-gold/20 hover:border-gold/50 transition-colors overflow-hidden group">
      <Link href={`/bazaar/${product.id}`}>
        <div className="aspect-square relative">
          <Badge className="absolute top-2 right-2 z-10 bg-gold text-black">{product.stock} left</Badge>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/bazaar/${product.id}`}>
          <h3 className="font-medium mb-1 hover:text-gold transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-muted-foreground",
                )}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.rating})</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        <p className="text-gold font-semibold text-lg">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-gold hover:bg-gold/90 text-black"
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  )
}
