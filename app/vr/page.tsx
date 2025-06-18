"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Info } from "lucide-react"
import { useState } from "react"

// Sample 3D models data
const models = [
  {
    id: 2,
    name: "Tutankhamun's Mask",
    description:
      "This iconic golden mask, discovered in 1925, is one of the most famous treasures from ancient Egypt and remains a symbol of the country's rich history.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/CairoEgMuseumTaaMaskMostlyPhotographed.jpg/1200px-CairoEgMuseumTaaMaskMostlyPhotographed.jpg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/4d5723e76ef446daabc293ce8fc332b8/embed",
  },
  {
    id: 4,
    name: "Rosetta Stone",
    description:
      "This ancient slab of black granodiorite, discovered in 1799, was key to deciphering Egyptian hieroglyphs and unlocked a wealth of knowledge about one of the world's oldest civilizations.",
    image:
      "https://www.britishmuseum.org/sites/default/files/styles/uncropped_huge/public/2022-06/Rosetta-Stone-in-situ.jpg?itok=BOzcDbrL",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/1e03509704a3490e99a173e53b93e282/embed",
  },
  {
    id: 5,
    name: "Egyptian Pharaohs Buildings",
    description: "Explore ancient Egyptian pharaonic architecture",
    image:
      "https://media.sketchfab.com/models/a730765db5344b7593d25671ce2c9f4f/thumbnails/155bc84fecb64e03af64d320ab7425a6/73c6065d3d5a4942a5c92edb3439bf32.jpeg",
    type: "monument",
    embedUrl: "https://sketchfab.com/models/a730765db5344b7593d25671ce2c9f4f/embed",
  },
  {
    id: 6,
    name: "Egyptian Pottery",
    description: "Examine ancient Egyptian pottery and ceramics",
    image:
      "https://media.sketchfab.com/models/47fcc5c4e54949a082a8b3508b8ada4f/thumbnails/d30ce3dc8cc042f09d8d4ba8a57dfbad/e8068737af1d4b1c9fb7ceae38e47a69.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/47fcc5c4e54949a082a8b3508b8ada4f/embed",
  },
  {
    id: 7,
    name: "Egyptian Weapons",
    description: "Study ancient Egyptian weaponry and tools",
    image:
      "https://media.sketchfab.com/models/3f04f9a7f9eb4ebabefea13a6b3d6cef/thumbnails/61e7e3bcd61d4778919b7a2ec973baa3/bb8a924a181f4dcdb601e8f6924bf910.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/3f04f9a7f9eb4ebabefea13a6b3d6cef/embed",
  },
  {
    id: 8,
    name: "Egypt Souvenir Box",
    description: "Examine a decorative Egyptian souvenir box",
    image:
      "https://media.sketchfab.com/models/8d2930eab3ba4ee58dbafeae9036a238/thumbnails/9684cfada43d412dbd7fd6317176bbd6/829e99fe2b4c4ed89482ac9bdf080893.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/8d2930eab3ba4ee58dbafeae9036a238/embed",
  },
  {
    id: 9,
    name: "Egyptian Obelisk",
    description:
      "These towering stone monuments, often inscribed with hieroglyphs, were erected to honor the gods and commemorate powerful pharaohs, standing as eternal symbols of ancient Egyptian civilization.",
    image:
      "https://media.sketchfab.com/models/88d990ba831648728850517056169939/thumbnails/ce920b76abe24252988f9a4fba85b14d/b6003758c9b14f4192e477e5a3822b98.jpeg",
    type: "monument",
    embedUrl: "https://sketchfab.com/models/88d990ba831648728850517056169939/embed",
  },
  {
    id: 10,
    name: "Nested Coffins of Iawttasheret",
    description: "Explore ancient Egyptian burial coffins",
    image:
      "https://media.sketchfab.com/models/d94cb95d440d48d4b3a3711410013f17/thumbnails/5f4601f1ad6f4c6ca3d773ba43bd9c46/d61d5bf493794f16a82f92d5c5da29f5.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/d94cb95d440d48d4b3a3711410013f17/embed",
  },
  {
    id: 11,
    name: "Egyptian Cat Statue",
    description: "Examine a statue of a cat, sacred to ancient Egyptians",
    image:
      "https://media.sketchfab.com/models/02b0456362f9442da46d39fb34b3ee5b/thumbnails/413b7ece335740a0a3e19958dfb89d70/c61fbb34d74a49ffb56b87c4f6719669.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/02b0456362f9442da46d39fb34b3ee5b/embed",
  },
  {
    id: 12,
    name: "Egyptian Crown with Uraeus",
    description: "Study the royal crown with cobra emblem",
    image:
      "https://media.sketchfab.com/models/3fe38e74b4cc4a2b84c907a06673b415/thumbnails/873228a87b054f11b876f6fda2c82bc2/1f022ffbb9844070b97e884ea8fff70c.jpeg",
    embedUrl: "https://sketchfab.com/models/3fe38e74b4cc4a2b84c907a06673b415/embed",
  },
  {
    id: 13,
    name: "Egyptian Scarab Beetle",
    description: "Examine the sacred scarab beetle artifact",
    image:
      "https://media.sketchfab.com/models/b4cd7baabeea42e192c54eb02ca72c1a/thumbnails/15fdfd4b4320493cabd083d87a180714/1024x576.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/b4cd7baabeea42e192c54eb02ca72c1a/embed",
  },
  {
    id: 14,
    name: "Egyptian Sandal",
    description: "Study ancient Egyptian footwear",
    image:
      "https://media.sketchfab.com/models/a412bc98d3504336bd1baa250dc9394a/thumbnails/b1ddfbdd4d584c45ae3be77904a32c11/377118089b6b451b91ebcbecebb279da.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/a412bc98d3504336bd1baa250dc9394a/embed",
  },
  {
    id: 15,
    name: "Egyptian Temple",
    description: "Explore the architecture of an Egyptian temple",
    image:
      "https://media.sketchfab.com/models/c46e7c4460ab4bea9628823a037068ed/thumbnails/963e20cbfea74639b8a62dec50584bf2/eb52f5b7b429466a8788b9def5fbe768.jpeg",
    type: "monument",
    embedUrl: "https://sketchfab.com/models/c46e7c4460ab4bea9628823a037068ed/embed",
  },
  {
    id: 16,
    name: "Egyptian Column",
    description: "Study the detailed design of an Egyptian column",
    image:
      "https://media.sketchfab.com/models/288240111c3e4d68867b932448db1bb4/thumbnails/437752b5e67443289918ba642f565e89/9738d66404cd4b19b23f3468cc54bf02.jpeg",
    type: "monument",
    embedUrl: "https://sketchfab.com/models/288240111c3e4d68867b932448db1bb4/embed",
  },
  {
    id: 17,
    name: "Coffins of Pa-di-mut, Mut-iy-y, and Ankh-Khonsu",
    description: "Examine ancient Egyptian burial coffins",
    image:
      "https://media.sketchfab.com/models/012ae83b8d9045468b30584883149035/thumbnails/264e2b5af5d642d4ac4b6ee5ee9f4a2d/69ebfde922c741eca8683b7734b0eba9.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/012ae83b8d9045468b30584883149035/embed",
  },
  {
    id: 18,
    name: "Ancient Egypt Pack",
    description: "Collection of various Egyptian artifacts",
    image:
      "https://media.sketchfab.com/models/a04604cf286242819f01b16395f23cd0/thumbnails/96196de1d70c43fca4fdbd5d3719566e/6f271859200741e1b57d6fe2e811d6a4.jpeg",
    type: "artifact",
    embedUrl: "https://sketchfab.com/models/a04604cf286242819f01b16395f23cd0/embed",
  },
]

export default function VRPage() {
  const [selectedModel, setSelectedModel] = useState(models[0])

  return (
    <div className="container py-8 px-4">
      <h1 className="font-cinzel text-3xl font-bold mb-6 text-gold">VR Experience</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AR Viewer */}
        <div className="lg:col-span-2">
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle>VR Viewer</CardTitle>
              <CardDescription>Explore 3D models of ancient Egyptian artifacts in virtual reality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* AR Viewer Canvas */}
              <div className="aspect-[4/3] bg-black/50 rounded-md flex items-center justify-center border border-gold/20 relative">
                {selectedModel ? (
                  <iframe
                    src={selectedModel.embedUrl}
                    width="100%"
                    height="100%"
                    className="rounded-md"
                    frameBorder="0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    data-execution-while-out-of-viewport="true"
                    data-execution-while-not-rendered="true"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="3D Model Preview"
                      width={800}
                      height={600}
                      className="rounded-md"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white bg-black/50 px-4 py-2 rounded-md">Select a model to view in AR</p>
                    </div>
                  </>
                )}
              </div>

              {/* AR Controls */}

              {/* Did You Know Card */}
              <Card className="border-gold/20 bg-gold/5">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-sm">
                    <Info className="mr-2 h-4 w-4 text-gold" /> Did You Know?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {selectedModel?.name}: {selectedModel?.description}
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Model Selection */}
        <div>
          <Card className="border-gold/20">
            <CardHeader>
              <CardTitle>Select Model</CardTitle>
              <CardDescription>Choose a 3D model to view in AR</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monuments" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="monuments">Monuments</TabsTrigger>
                  <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
                </TabsList>

                <TabsContent value="monuments" className="mt-4 space-y-4">
                  {models
                    .filter((model) => model.type === "monument")
                    .map((model) => (
                      <ModelCard key={model.id} model={model} onSelect={setSelectedModel} />
                    ))}
                </TabsContent>

                <TabsContent value="artifacts" className="mt-4 space-y-4">
                  {models
                    .filter((model) => model.type === "artifact")
                    .map((model) => (
                      <ModelCard key={model.id} model={model} onSelect={setSelectedModel} />
                    ))}
                </TabsContent>

                <TabsContent value="gods" className="mt-4 space-y-4">
                  {models
                    .filter((model) => model.type === "artifact")
                    .slice(0, 3)
                    .map((model) => (
                      <ModelCard key={model.id} model={model} onSelect={setSelectedModel} />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ModelCard({ model, onSelect }) {
  return (
    <Card className="border-gold/20 hover:border-gold/50 transition-colors overflow-hidden">
      <div className="flex">
        <div className="w-1/3">
          <Image
            src={model.image || "/placeholder.svg"}
            alt={model.name}
            width={100}
            height={100}
            className="object-cover h-full"
          />
        </div>
        <div className="w-2/3 p-3">
          <h3 className="font-medium text-sm">{model.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{model.description}</p>
          <Button
            size="sm"
            className="w-full bg-gold hover:bg-gold/90 text-black text-xs"
            onClick={() => onSelect(model)}
          >
            View in VR
          </Button>
        </div>
      </div>
    </Card>
  )
}
