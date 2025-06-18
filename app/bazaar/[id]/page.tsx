"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart/cart-context"
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  StarHalf,
  Truck,
  ShieldCheck,
  Package,
  Heart,
  Share2,
  Minus,
  Plus,
  Check,
} from "lucide-react"
import Link from "next/link"

// Mock product data - in a real app, this would come from an API or database
const products = [
  {
    id: 1,
    name: "Gold Scarab Pendant",
    price: 129.99,
    image: "https://huntersfinejewellery.com/cdn/shop/articles/ruby-scarab-pendant.jpg?v=1728505386&width=1500",
    category: "jewelry",
    rating: 4.8,
    description:
      "This exquisite gold scarab pendant is inspired by ancient Egyptian symbolism. The scarab beetle was considered sacred in ancient Egypt, representing rebirth and regeneration. Crafted with meticulous attention to detail, this pendant features intricate engravings and is made from high-quality gold-plated brass with semi-precious stones.",
    features: [
      "Handcrafted by skilled artisans",
      "Gold-plated brass with semi-precious stones",
      "Adjustable 18-inch chain included",
      "Inspired by authentic ancient Egyptian designs",
      "Comes in a luxury gift box with certificate of authenticity",
    ],
    specifications: {
      Material: "Gold-plated brass, semi-precious stones",
      Dimensions: "1.5 inches x 1 inch",
      Weight: "15 grams",
      Chain: "18-inch adjustable gold-plated chain",
      Origin: "Handcrafted in Egypt",
    },
    stock: 12,
    reviews: [
      {
        id: 1,
        user: "Sarah M.",
        rating: 5,
        date: "2023-10-15",
        comment:
          "Absolutely beautiful piece! The craftsmanship is exceptional and it looks even better in person. I've received so many compliments when wearing it.",
      },
      {
        id: 2,
        user: "Michael T.",
        rating: 4,
        date: "2023-09-22",
        comment:
          "Bought this as a gift for my wife who loves Egyptian culture. She was thrilled with it. The only minor issue was the chain being a bit delicate.",
      },
      {
        id: 3,
        user: "Amira H.",
        rating: 5,
        date: "2023-08-30",
        comment:
          "As an Egyptian, I appreciate the attention to detail and cultural accuracy. This pendant is a beautiful representation of our heritage.",
      },
    ],
    relatedProducts: [4, 2, 6],
    images: [
      "https://huntersfinejewellery.com/cdn/shop/articles/ruby-scarab-pendant.jpg?v=1728505386&width=1500",
      "https://cdn.shopify.com/s/files/1/0245/9628/3426/files/scarab-beetle-pendant-18k-gold_480x480.jpg?v=1714216535",
      "https://huntersfinejewellery.com/cdn/shop/products/DSC_0374.jpg?v=1717776383&width=713",
    ],
  },
  {
    id: 2,
    name: "Handcrafted Papyrus Art",
    price: 49.99,
    image: "https://m.media-amazon.com/images/I/91sZav3ZXmL._AC_UF894,1000_QL80_.jpg",
    category: "papyrus",
    rating: 4.5,
    description:
      "This authentic handcrafted papyrus art piece showcases traditional Egyptian scenes painted by skilled local artists. Each piece is made using traditional methods that have been passed down through generations, creating a genuine piece of Egyptian cultural heritage for your home.",
    features: [
      "100% authentic Egyptian papyrus",
      "Hand-painted using traditional techniques",
      "Ready to frame (frame not included)",
      "Signed by the artist",
      "Certificate of authenticity included",
    ],
    specifications: {
      Material: "Genuine papyrus",
      Dimensions: "12 inches x 16 inches",
      Technique: "Hand-painted",
      Origin: "Made in Egypt",
      Care: "Keep away from direct sunlight and moisture",
    },
    stock: 8,
    reviews: [
      {
        id: 1,
        user: "Robert J.",
        rating: 5,
        date: "2023-11-05",
        comment:
          "The colors are vibrant and the artwork is stunning. It's now the centerpiece of my living room and everyone asks about it.",
      },
      {
        id: 2,
        user: "Lisa K.",
        rating: 4,
        date: "2023-10-12",
        comment:
          "Beautiful piece of art. I appreciate the certificate of authenticity. Shipping took a bit longer than expected, but worth the wait.",
      },
    ],
    relatedProducts: [3, 5, 6],
    images: [
      "https://m.media-amazon.com/images/I/91sZav3ZXmL._AC_UF894,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/617IYjTTtpL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71EZVg+ULML._AC_SY879_.jpg",
    ],
  },
  {
    id: 3,
    name: "Alabaster Canopic Jar",
    price: 199.99,
    image: "https://m.media-amazon.com/images/I/71eQEAivRPL._AC_SX679_.jpg",
    category: "sculpture",
    rating: 4.9,
    description:
      "This exquisite alabaster canopic jar is a faithful reproduction of those used in ancient Egyptian mummification rituals. Canopic jars were used to store the organs of the deceased, and each jar was protected by one of the four sons of Horus. This particular jar features the falcon-headed Qebehsenuef, who protected the intestines.",
    features: [
      "Hand-carved from genuine Egyptian alabaster",
      "Detailed hieroglyphic inscriptions",
      "Removable lid with falcon-headed deity",
      "Historically accurate design",
      "Protective felt base to prevent scratching surfaces",
    ],
    specifications: {
      Material: "Egyptian alabaster",
      Height: "10 inches",
      Diameter: "4 inches",
      Weight: "3.5 pounds",
      Origin: "Handcrafted in Luxor, Egypt",
    },
    stock: 5,
    reviews: [
      {
        id: 1,
        user: "James H.",
        rating: 5,
        date: "2023-09-18",
        comment:
          "The craftsmanship is outstanding. As an archaeology enthusiast, I appreciate the historical accuracy and attention to detail.",
      },
      {
        id: 2,
        user: "Emma L.",
        rating: 5,
        date: "2023-08-25",
        comment:
          "A stunning piece that has become the focal point of my collection. The alabaster has beautiful natural variations.",
      },
      {
        id: 3,
        user: "David R.",
        rating: 4,
        date: "2023-07-30",
        comment:
          "Very impressive reproduction. The only reason for 4 stars instead of 5 is that it arrived with a small chip that had to be repaired.",
      },
    ],
    relatedProducts: [6, 5, 2],
    images: [
      "https://m.media-amazon.com/images/I/71eQEAivRPL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/61w67-1jOtL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/61zoFFhIpRL._AC_SX679_.jpg",
    ],
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
      "The Ankh, also known as the key of life, is an ancient Egyptian hieroglyphic symbol representing life itself. This elegant sterling silver Ankh necklace combines historical significance with contemporary style, making it a meaningful piece of jewelry that connects the wearer to ancient Egyptian wisdom and spirituality.",
    features: [
      "Made from 925 sterling silver",
      "Detailed engravings on both sides",
      "18-inch sterling silver chain included",
      "Secure lobster clasp",
      "Comes in a velvet gift pouch",
    ],
    specifications: {
      Material: "925 Sterling Silver",
      PendantSize: "1.5 inches tall",
      ChainLength: "18 inches",
      Weight: "12 grams",
      Finish: "Polished with antiqued details",
    },
    stock: 15,
    reviews: [
      {
        id: 1,
        user: "Olivia P.",
        rating: 5,
        date: "2023-10-28",
        comment:
          "This necklace is beautiful and meaningful. The craftsmanship is excellent and it has a nice weight to it that makes it feel substantial.",
      },
      {
        id: 2,
        user: "Thomas B.",
        rating: 4,
        date: "2023-09-15",
        comment:
          "Great quality and design. I bought it as a gift for my girlfriend who loves Egyptian symbols and she wears it almost daily.",
      },
    ],
    relatedProducts: [1, 6, 2],
    images: [
      "https://wootandhammy.com/cdn/shop/products/large-ankh-with-horus-eye-and-hieroglyphs-oxidized-pendant-dp-1563-1165-3.jpg?v=1678315139",
      "https://wootandhammy.com/cdn/shop/products/large-ankh-with-horus-eye-and-hieroglyphs-oxidized-pendant-dp-1563-1165-2.jpg?v=1678412594",
      "https://wootandhammy.com/cdn/shop/products/large-ankh-with-horus-eye-and-hieroglyphs-oxidized-pendant-dp-1563-1165-7.jpg?v=1678315139",
    ],
  },
  {
    id: 5,
    name: "Handmade Egyptian Carpet",
    price: 299.99,
    image: "https://i.ebayimg.com/images/g/Q8MAAOSwCyRlWZZC/s-l1600.webp",
    category: "home",
    rating: 4.6,
    description:
      "This luxurious handmade Egyptian carpet features traditional patterns inspired by ancient Egyptian motifs and hieroglyphs. Each carpet is meticulously hand-knotted by skilled artisans using techniques passed down through generations. The natural wool and cotton materials ensure durability while the intricate designs add a touch of ancient Egyptian elegance to any space.",
    features: [
      "100% hand-knotted by skilled artisans",
      "Made from natural wool and cotton",
      "Traditional Egyptian patterns and motifs",
      "Naturally dyed using traditional methods",
      "Each piece is unique with slight variations",
    ],
    specifications: {
      Material: "Natural wool and cotton",
      Dimensions: "4 feet x 6 feet",
      KnotDensity: "120 knots per square inch",
      Origin: "Handcrafted in Cairo, Egypt",
      Care: "Professional cleaning recommended",
    },
    stock: 3,
    reviews: [
      {
        id: 1,
        user: "Jennifer K.",
        rating: 5,
        date: "2023-11-10",
        comment:
          "This carpet exceeded my expectations. The craftsmanship is exceptional and the colors are even more vibrant in person. It's truly a work of art.",
      },
      {
        id: 2,
        user: "Richard M.",
        rating: 4,
        date: "2023-10-05",
        comment:
          "Beautiful carpet with amazing detail. The only reason for 4 stars is that the colors were slightly different than shown in the photos, but still beautiful.",
      },
      {
        id: 3,
        user: "Sophia L.",
        rating: 5,
        date: "2023-09-22",
        comment:
          "Worth every penny! This carpet has transformed my living room and I receive compliments from everyone who visits. The quality is outstanding.",
      },
    ],
    relatedProducts: [2, 6, 3],
    images: [
      "https://i.ebayimg.com/images/g/Q8MAAOSwCyRlWZZC/s-l1600.webp",
      "https://i.ebayimg.com/images/g/iJAAAOSwyBtlWZZD/s-l1600.webp",
      "https://i.ebayimg.com/images/g/Q8MAAOSwCyRlWZZC/s-l1600.webp",
    ],
  },
  {
    id: 6,
    name: "Bastet Cat Figurine",
    price: 59.99,
    image: "https://m.media-amazon.com/images/I/81knjtWP+iL._AC_SX679_.jpg",
    category: "sculpture",
    rating: 4.4,
    description:
      "This elegant Bastet cat figurine is inspired by the ancient Egyptian goddess of home, fertility, and protection. Bastet was depicted as a lioness or as a woman with the head of a lioness or domestic cat. This detailed reproduction captures the regal and mysterious nature of the goddess, making it a perfect decorative piece for Egyptian art enthusiasts.",
    features: [
      "Hand-finished cold cast resin with bronze finish",
      "Detailed hieroglyphic inscriptions on the base",
      "Felt-padded bottom to protect surfaces",
      "Based on artifacts from the Cairo Museum",
      "Includes informational card about Bastet",
    ],
    specifications: {
      Material: "Cold cast resin with bronze finish",
      Height: "8 inches",
      Width: "3 inches",
      Weight: "1.2 pounds",
      Care: "Dust with soft cloth, avoid moisture",
    },
    stock: 20,
    reviews: [
      {
        id: 1,
        user: "Catherine J.",
        rating: 5,
        date: "2023-10-20",
        comment:
          "Beautiful figurine with amazing detail. It looks much more expensive than it is and makes a perfect addition to my Egyptian collection.",
      },
      {
        id: 2,
        user: "Mark S.",
        rating: 4,
        date: "2023-09-08",
        comment:
          "Nice quality and detail. The bronze finish is well done. I removed one star because it's a bit smaller than I expected, but still a great piece.",
      },
      {
        id: 3,
        user: "Nora P.",
        rating: 4,
        date: "2023-08-15",
        comment:
          "Lovely figurine that captures the essence of Bastet. The only issue was some minor imperfections in the finish, but overall I'm very satisfied.",
      },
    ],
    relatedProducts: [3, 2, 5],
    images: [
      "https://m.media-amazon.com/images/I/81knjtWP+iL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/71IKBtwA2aL._AC_SX679_.jpg",
      "https://m.media-amazon.com/images/I/6113rPESMRL._AC_SL1489_.jpg",
    ],
  },
]

// Helper function to get related products
const getRelatedProducts = (relatedIds: number[]) => {
  return relatedIds.map((id) => products.find((product) => product.id === id)).filter(Boolean)
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState("description")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  // Find the product based on the ID from the URL
  const productId = Number(params.id)
  const product = products.find((p) => p.id === productId)

  if (!product) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold text-gold mb-4 font-cinzel">Product Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/bazaar">
          <Button className="bg-gold hover:bg-gold/90 text-black">Return to Bazaar</Button>
        </Link>
      </div>
    )
  }

  const relatedProducts = getRelatedProducts(product.relatedProducts || [])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
  }

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }

    router.push("/bazaar/checkout")
  }

  const renderRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-gold text-gold" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="h-4 w-4 fill-gold text-gold" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />)
    }

    return stars
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold ml-2">{product.name}</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-accent">
            <img
              src={product.images?.[activeImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto py-1">
            {(product.images || [product.image]).map((image, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                  activeImageIndex === index ? "border-gold" : "border-transparent"
                }`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} - view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center">
              <Badge className="bg-gold text-black">{product.category}</Badge>
              <div className="ml-auto flex items-center">
                <div className="flex">{renderRatingStars(product.rating)}</div>
                <span className="text-sm ml-1">({product.rating})</span>
              </div>
            </div>

            <h1 className="text-2xl font-bold mt-2">{product.name}</h1>
            <p className="text-2xl font-bold text-gold mt-1">${product.price.toFixed(2)}</p>

            <div className="flex items-center mt-2 text-sm">
              <div className="flex items-center text-green-500">
                <Check className="h-4 w-4 mr-1" />
                <span>In Stock</span>
              </div>
              <span className="mx-2 text-muted-foreground">•</span>
              <span className="text-muted-foreground">{product.stock} available</span>
            </div>
          </div>

          <Separator className="bg-gold/20" />

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm">Quantity:</span>
              <div className="flex items-center border border-gold/20 rounded-md ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1 bg-gold hover:bg-gold/90 text-black" onClick={handleAddToCart}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" className="flex-1 border-gold/20" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator className="bg-gold/20" />

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Truck className="h-4 w-4 mr-2 text-gold" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center text-sm">
              <ShieldCheck className="h-4 w-4 mr-2 text-gold" />
              <span>Authenticity guaranteed</span>
            </div>
            <div className="flex items-center text-sm">
              <Package className="h-4 w-4 mr-2 text-gold" />
              <span>Secure packaging for safe delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="space-y-4 mt-4">
            <p className="text-sm">{product.description}</p>

            {product.features && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-sm">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            {product.specifications && (
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium">{key}</span>
                    <span className="text-sm">{value as string}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-4">
            <div className="flex items-center mb-4">
              <div className="flex mr-2">{renderRatingStars(product.rating)}</div>
              <span className="font-medium">{product.rating} out of 5</span>
            </div>

            {product.reviews?.length ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="border-gold/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{review.user}</p>
                          <div className="flex mt-1">{renderRatingStars(review.rating)}</div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="mt-2 text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}

            <Button className="mt-4 bg-gold hover:bg-gold/90 text-black">Write a Review</Button>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <Card
                key={relatedProduct?.id}
                className="overflow-hidden border-gold/20 hover:border-gold/50 transition-colors"
              >
                <Link href={`/bazaar/${relatedProduct?.id}`}>
                  <div className="aspect-square relative bg-accent">
                    <img
                      src={relatedProduct?.image || "/placeholder.svg"}
                      alt={relatedProduct?.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{relatedProduct?.name}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-gold font-semibold">${relatedProduct?.price.toFixed(2)}</p>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 fill-gold text-gold mr-1" />
                        <span className="text-xs">{relatedProduct?.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
