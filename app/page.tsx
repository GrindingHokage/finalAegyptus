import Link from "next/link"
import Image from "next/image"

import { Camera, Languages, ShoppingBag, Glasses, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.britishmuseum.org/sites/default/files/styles/bm_gallery_medium_700h/public/2022-06/Hieroglyphs_unlocking_ancient_Egypt_hero.jpg?itok=CoQzKChb"
            alt="Ancient Egyptian pyramids"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold mb-6 text-gold">AEGYPTUS</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">Ancient Egypt Reimagined for the Modern World</p>
          <Link href="/translate">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-medium">
              <Camera className="mr-2 h-5 w-5" /> Scan Hieroglyphs
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container px-4 py-16">
        <h2 className="font-cinzel text-3xl font-bold mb-10 text-center">Explore Ancient Egypt</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Translate Card */}
          <Card className="border border-gold/20 hover:border-gold/50 transition-colors">
            <CardHeader>
              <Languages className="h-10 w-10 text-gold mb-2" />
              <CardTitle>Translate</CardTitle>
              <CardDescription>Decode hieroglyphs with AI-powered translation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Upload images or use your camera to translate ancient Egyptian hieroglyphs into modern languages
                instantly.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/translate" className="w-full">
                <Button variant="outline" className="w-full border-gold/20 hover:border-gold/50">
                  Start Translating
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* AR Experience Card */}
          <Card className="border border-gold/20 hover:border-gold/50 transition-colors">
            <CardHeader>
              <Glasses className="h-10 w-10 text-gold mb-2" />
              <CardTitle>VR Experience</CardTitle>
              <CardDescription>Immerse yourself in ancient artifacts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Explore 3D models of pyramids, artifacts, and tools in virtual reality right from your browser.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/vr" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-gold/20 hover:border-gold/50 mx-0 px-0 py-0 space-y-32 my-5"
                >
                  Launch VR
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* E-Bazaar Card */}
          <Card className="border border-gold/20 hover:border-gold/50 transition-colors">
            <CardHeader>
              <ShoppingBag className="h-10 w-10 text-gold mb-2" />
              <CardTitle>E-Bazaar</CardTitle>
              <CardDescription>Shop authentic Egyptian goods</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse and purchase handcrafted jewelry, papyrus art, and sculptures from verified Egyptian artisans.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/bazaar" className="w-full">
                <Button variant="outline" className="w-full border-gold/20 hover:border-gold/50 py-0 space-y-80 my-5">
                  Visit Bazaar
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Virtual Tourism Card */}
          <Card className="border border-gold/20 hover:border-gold/50 transition-colors">
            <CardHeader>
              <Map className="h-10 w-10 text-gold mb-2" />
              <CardTitle>Egypt Explorer</CardTitle>
              <CardDescription>Explore historical sites</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Discover ancient Egyptian sites with interactive maps, detailed information.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/sites" className="w-full">
                <Button variant="outline" className="w-full border-gold/20 hover:border-gold/50 my-10">
                  Explore Sites
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
