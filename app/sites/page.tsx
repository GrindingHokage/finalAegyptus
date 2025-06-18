"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bookmark, Navigation, Info, Search, X, Share2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { loadSitesData, type SiteData } from "@/lib/sites-data"

export default function SitesPage() {
  const [sites, setSites] = useState<SiteData[]>([])
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null)
  const [bookmarkedSites, setBookmarkedSites] = useState<number[]>([])
  const { toast } = useToast()

  // Load sites data
  useEffect(() => {
    async function fetchSites() {
      try {
        const data = await loadSitesData()
        setSites(data)
        setFilteredSites(data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to load sites data:", error)
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  // Load bookmarked sites from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("aegyptus-bookmarked-sites")
    if (savedBookmarks) {
      try {
        setBookmarkedSites(JSON.parse(savedBookmarks))
      } catch (error) {
        console.error("Failed to parse bookmarked sites:", error)
      }
    }
  }, [])

  // Save bookmarked sites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("aegyptus-bookmarked-sites", JSON.stringify(bookmarkedSites))
  }, [bookmarkedSites])

  // Filter sites based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSites(sites)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = sites.filter(
      (site) =>
        site.name.toLowerCase().includes(query) ||
        site.location.toLowerCase().includes(query) ||
        site.description.toLowerCase().includes(query),
    )
    setFilteredSites(filtered)
  }, [searchQuery, sites])

  // Handle bookmark toggle
  const toggleBookmark = (siteId: number) => {
    const site = sites.find((s) => s.id === siteId)
    if (!site) return

    setBookmarkedSites((prev) => {
      const isCurrentlyBookmarked = prev.includes(siteId)

      if (isCurrentlyBookmarked) {
        // Remove from bookmarks
        toast({
          title: "Site removed from bookmarks",
          description: "You can add it back anytime.",
        })

        // Remove from saved sites in localStorage
        const savedSites = JSON.parse(localStorage.getItem("aegyptus_saved_sites") || "[]")
        const updatedSavedSites = savedSites.filter((savedSite) => savedSite.id !== siteId.toString())
        localStorage.setItem("aegyptus_saved_sites", JSON.stringify(updatedSavedSites))

        return prev.filter((id) => id !== siteId)
      } else {
        // Add to bookmarks
        toast({
          title: "Site bookmarked",
          description: "You can find it in your profile.",
        })

        // Add to saved sites in localStorage
        const savedSites = JSON.parse(localStorage.getItem("aegyptus_saved_sites") || "[]")
        const newSavedSite = {
          id: siteId.toString(),
          name: site.name,
          description: site.description,
          location: site.location,
          image: site.image || "/placeholder.svg?height=80&width=80&text=" + encodeURIComponent(site.name),
          dateAdded: new Date().toISOString(),
        }

        // Check if site is already saved to avoid duplicates
        const existingSite = savedSites.find((savedSite) => savedSite.id === siteId.toString())
        if (!existingSite) {
          savedSites.unshift(newSavedSite)
          localStorage.setItem("aegyptus_saved_sites", JSON.stringify(savedSites))
        }

        return [...prev, siteId]
      }
    })
  }

  // Handle share
  const handleShare = async (site: SiteData) => {
    // Create the base share message
    const baseShareMessage = `${site.name} - ${site.location}\n\n${site.description}\n\nShared from AEGYPTUS app`

    // Create a share URL - use Google Maps URL if coordinates are available
    const googleMapsUrl = site.coordinates
      ? `https://www.google.com/maps/search/?api=1&query=${site.coordinates.lat},${site.coordinates.lng}`
      : window.location.href // Fallback if no coordinates

    // Combine message and URL for clipboard
    const clipboardContent = `${baseShareMessage}\n\n${googleMapsUrl}`

    // Go directly to clipboard copy (skip Web Share API due to permission issues)
    copyToClipboard(clipboardContent, site.name)
  }

  // Helper function to copy to clipboard with custom toast notification
  const copyToClipboard = (text: string, siteName: string) => {
    try {
      navigator.clipboard.writeText(text).then(
        () => {
          showCustomToast("Copied to clipboard")
        },
        (err) => {
          console.error("Clipboard write failed:", err)
          fallbackCopyToClipboard(text, siteName)
        },
      )
    } catch (error) {
      console.error("Clipboard API not available:", error)
      fallbackCopyToClipboard(text, siteName)
    }
  }

  // Fallback method for older browsers
  const fallbackCopyToClipboard = (text: string, siteName: string) => {
    // Create temporary input element
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed" // Avoid scrolling to bottom
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      if (successful) {
        showCustomToast("Copied to clipboard")
      } else {
        toast({
          title: "Couldn't copy content",
          description: `Please manually copy this: ${text}`,
        })
      }
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err)
      toast({
        title: "Couldn't copy content",
        description: `Please manually copy this: ${text}`,
        variant: "destructive",
      })
    }

    document.body.removeChild(textArea)
  }

  // Custom toast notification function
  const showCustomToast = (message: string) => {
    // Remove any existing toast
    const existingToast = document.getElementById("custom-toast")
    if (existingToast) {
      existingToast.remove()
    }

    // Create toast element
    const toast = document.createElement("div")
    toast.id = "custom-toast"
    toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: white;
      color: #1f2937;
      padding: 12px 16px;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
      border: 1px solid #e5e7eb;
    ">
      <div style="
        width: 20px;
        height: 20px;
        background: #10b981;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      </div>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        padding: 0;
        margin-left: 8px;
        font-size: 16px;
        line-height: 1;
      ">×</button>
    </div>
  `

    // Add to document
    document.body.appendChild(toast)

    // Trigger animation
    requestAnimationFrame(() => {
      const toastElement = toast.querySelector("div") as HTMLElement
      if (toastElement) {
        toastElement.style.opacity = "1"
        toastElement.style.transform = "translateY(0)"
      }
    })

    // Auto-dismiss after 2.5 seconds
    setTimeout(() => {
      const toastElement = toast.querySelector("div") as HTMLElement
      if (toastElement) {
        toastElement.style.opacity = "0"
        toastElement.style.transform = "translateY(10px)"
        setTimeout(() => {
          if (toast.parentNode) {
            toast.remove()
          }
        }, 300)
      }
    }, 2500)
  }

  // Get a truncated description
  const getTruncatedDescription = (description: string, wordCount = 25) => {
    const words = description.split(" ")
    if (words.length <= wordCount) return description
    return words.slice(0, wordCount).join(" ") + "..."
  }

  return (
    <div className="container py-8 px-4">
      <h1 className="font-cinzel text-3xl font-bold mb-6 text-gold">Sites</h1>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search sites by name, location, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-gold/20 focus-visible:ring-gold"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Interactive Map */}
      <Card className="border-gold/20 mb-8">
        <CardHeader>
          <CardTitle>Interactive Map</CardTitle>
          <CardDescription>Explore ancient Egyptian sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/9] bg-black/50 rounded-md border border-gold/20 relative overflow-hidden">
            <iframe
              src="https://archmap.cultnat.org/Map.aspx"
              title="Interactive Map of Egyptian Archaeological Sites"
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <SiteCardSkeleton key={i} />)
          : filteredSites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                isBookmarked={bookmarkedSites.includes(site.id)}
                onToggleBookmark={() => toggleBookmark(site.id)}
                onShare={handleShare}
                onViewDetails={() => setSelectedSite(site)}
              />
            ))}
      </div>

      {/* No Results Message */}
      {!loading && filteredSites.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No sites found matching your search criteria.</p>
          <Button variant="link" className="mt-2 text-gold" onClick={() => setSearchQuery("")}>
            Clear search and show all sites
          </Button>
        </div>
      )}

      {/* Site Details Dialog */}
      <Dialog open={!!selectedSite} onOpenChange={(open) => !open && setSelectedSite(null)}>
        {selectedSite && (
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-cinzel text-gold">{selectedSite.name}</DialogTitle>
              <DialogDescription>{selectedSite.location}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="aspect-video relative rounded-md overflow-hidden">
                <Image
                  src={selectedSite.image || "/placeholder.svg"}
                  alt={selectedSite.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Get the site name to find the appropriate fallback image
                    const siteName = selectedSite.name
                    // Map of site names to specific fallback images
                    const siteFallbackImages = {
                      "Pyramids of Giza":
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1200px-All_Gizah_Pyramids.jpg",
                      "Temple of Karnak": "https://batnomad.com/wp-content/uploads/2017/12/P1040401-1024x641.jpg",
                      "Valley of the Kings":
                        "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/1a/9f/6c/valley-og-the-kings.jpg?w=900&h=500&s=1",
                      "Abu Simbel Temples": "https://www.traveltoegypt.net/front/images/blog/AbuSimbel2.jpg",
                      "Temple of Hatshepsut":
                        "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/activity_headers/324432/2000x2000-0-70-4880c7bbcc0821c699c954fd17286148.jpg",
                      "Philae Temple":
                        "https://egymonuments.gov.eg//media/2509/dsc_1871c.jpg?center=0.48299319727891155,0.52036199095022628&mode=crop&width=1200&height=630&rnd=133748558720000000",
                      "Luxor Temple": "https://egyptescapes.com/wp-content/uploads/2022/04/luxortemple-1.jpg",
                      "Temple of Edfu":
                        "https://unitedguidestravel.com/wp-content/uploads/2022/04/interior-desgin-inside-temple-of-edfu.jpg",
                      "Temple of Kom Ombo":
                        "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/41668/cms/568459/940x500-1-50-f3d80972463bdb699e3812bb7bc878c5.jpg",
                      "Medinet Habu":
                        "https://historicaleve.com/wp-content/uploads/2024/02/The-Mortuary-Temple-of-Ramesses-III-at-Medinet-Habu-960x675.jpg",
                      "Temple of Dendera": "https://www.citibondholidays.co.uk/wp-content/uploads/2024/02/Egypt_02.jpg",
                      "Step Pyramid of Djoser":
                        "https://www.thoughtco.com/thmb/LZHNVPqn3gh5etdJrMu_gNU_1JQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Djoser_Step_Pyramid-5683d9385f9b586a9e03e725.jpg",
                      "Colossi of Memnon":
                        "https://www.introducingegypt.com/f/egipto/egipto/guia/colosos-de-memnon.jpg",
                      "Temple of Abydos": "https://bastettravel.com/wp-content/uploads/2024/05/Temple-of-Abydos.jpg",
                      "Bent Pyramid":
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Snefru%27s_Bent_Pyramid_in_Dahshur.jpg/1200px-Snefru%27s_Bent_Pyramid_in_Dahshur.jpg",
                      "Red Pyramid": "https://www.traveltoegypt.net/front/images/blog/The-red-pyramid-of-Dahshur.jpg",
                      "Temple of Esna":
                        "https://nilecruisetrips.com/wp-content/uploads/2022/09/Esna-Temple-from-Luxor-1200x540.jpg",
                      Ramesseum: "https://egymonuments.gov.eg/media/8507/whatsapp-image-2024-11-19-at-114258-am.jpeg",
                      "Temple of Kalabsha":
                        "https://nilecruisetrips.com/wp-content/uploads/2022/08/Temple-of-Kalabsha.jpg",
                      "Pyramid of Meidum":
                        "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/11/aerial-view-of-ancient-ruins-ramesseum-luxor-egypt.jpg",
                      "Temple of Hibis": "https://www.arabcont.com/Images/ProjectImage/habees16.jpg",
                    }

                    // Use specific image for the site if available, otherwise use a generic placeholder
                    const fallbackImage =
                      siteFallbackImages[siteName] ||
                      "/placeholder.svg?height=300&width=500&text=" + encodeURIComponent(siteName)
                    e.currentTarget.src = fallbackImage
                  }}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-gold/20 text-gold">
                    {selectedSite.distance}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold/20"
                      onClick={() => toggleBookmark(selectedSite.id)}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${bookmarkedSites.includes(selectedSite.id) ? "fill-gold text-gold" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gold/20"
                      onClick={() => handleShare(selectedSite)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm">{selectedSite.description}</p>
                {selectedSite.coordinates && (
                  <Button
                    className="w-full bg-gold hover:bg-gold/90 text-black"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${selectedSite.coordinates?.lat},${selectedSite.coordinates?.lng}`,
                        "_blank",
                      )
                    }
                  >
                    <Navigation className="mr-2 h-4 w-4" /> View on Google Maps
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

function SiteCard({ site, isBookmarked, onToggleBookmark, onShare, onViewDetails }) {
  return (
    <Card className="border-gold/20 hover:border-gold/50 transition-colors overflow-hidden group">
      <div className="aspect-video relative">
        <Image
          src={site.image || "/placeholder.svg"}
          alt={site.name}
          fill
          className="object-cover"
          onError={(e) => {
            // Get the site name to find the appropriate fallback image
            const siteName = site.name
            // Map of site names to specific fallback images
            const siteFallbackImages = {
              "Pyramids of Giza":
                "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/All_Gizah_Pyramids.jpg/1200px-All_Gizah_Pyramids.jpg",
              "Temple of Karnak": "https://batnomad.com/wp-content/uploads/2017/12/P1040401-1024x641.jpg",
              "Valley of the Kings":
                "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/30/1a/9f/6c/valley-og-the-kings.jpg?w=900&h=500&s=1",
              "Abu Simbel Temples": "https://www.traveltoegypt.net/front/images/blog/AbuSimbel2.jpg",
              "Temple of Hatshepsut":
                "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/activity_headers/324432/2000x2000-0-70-4880c7bbcc0821c699c954fd17286148.jpg",
              "Philae Temple":
                "https://egymonuments.gov.eg//media/2509/dsc_1871c.jpg?center=0.48299319727891155,0.52036199095022628&mode=crop&width=1200&height=630&rnd=133748558720000000",
              "Luxor Temple": "https://egyptescapes.com/wp-content/uploads/2022/04/luxortemple-1.jpg",
              "Temple of Edfu":
                "https://unitedguidestravel.com/wp-content/uploads/2022/04/interior-desgin-inside-temple-of-edfu.jpg",
              "Temple of Kom Ombo":
                "https://d3rr2gvhjw0wwy.cloudfront.net/uploads/mandators/41668/cms/568459/940x500-1-50-f3d80972463bdb699e3812bb7bc878c5.jpg",
              "Medinet Habu":
                "https://historicaleve.com/wp-content/uploads/2024/02/The-Mortuary-Temple-of-Ramesses-III-at-Medinet-Habu-960x675.jpg",
              "Temple of Dendera": "https://www.citibondholidays.co.uk/wp-content/uploads/2024/02/Egypt_02.jpg",
              "Step Pyramid of Djoser":
                "https://www.thoughtco.com/thmb/LZHNVPqn3gh5etdJrMu_gNU_1JQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Djoser_Step_Pyramid-5683d9385f9b586a9e03e725.jpg",
              "Colossi of Memnon": "https://www.introducingegypt.com/f/egipto/egipto/guia/colosos-de-memnon.jpg",
              "Temple of Abydos": "https://bastettravel.com/wp-content/uploads/2024/05/Temple-of-Abydos.jpg",
              "Bent Pyramid":
                "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Snefru%27s_Bent_Pyramid_in_Dahshur.jpg/1200px-Snefru%27s_Bent_Pyramid_in_Dahshur.jpg",
              "Red Pyramid": "https://www.traveltoegypt.net/front/images/blog/The-red-pyramid-of-Dahshur.jpg",
              "Temple of Esna":
                "https://nilecruisetrips.com/wp-content/uploads/2022/09/Esna-Temple-from-Luxor-1200x540.jpg",
              Ramesseum: "https://egymonuments.gov.eg/media/8507/whatsapp-image-2024-11-19-at-114258-am.jpeg",
              "Temple of Kalabsha": "https://nilecruisetrips.com/wp-content/uploads/2022/08/Temple-of-Kalabsha.jpg",
              "Pyramid of Meidum":
                "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/11/aerial-view-of-ancient-ruins-ramesseum-luxor-egypt.jpg",
              "Temple of Hibis": "https://www.arabcont.com/Images/ProjectImage/habees16.jpg",
            }

            // Use specific image for the site if available, otherwise use a generic placeholder
            const fallbackImage =
              siteFallbackImages[siteName] ||
              "/placeholder.svg?height=300&width=500&text=" + encodeURIComponent(siteName)
            e.currentTarget.src = fallbackImage
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{site.name}</CardTitle>
            <CardDescription>{site.location}</CardDescription>
          </div>
          <div className="text-sm text-gold font-medium">{site.distance}</div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{getTruncatedDescription(site.description)}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button className="flex-1 bg-gold hover:bg-gold/90 text-black" onClick={onViewDetails}>
          <Info className="mr-2 h-4 w-4" /> Details
        </Button>
        <Button
          variant="outline"
          className={`border-gold/20 ${isBookmarked ? "bg-gold/10" : ""}`}
          onClick={onToggleBookmark}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-gold text-gold" : ""}`} />
        </Button>
        <Button
          variant="outline"
          className="border-gold/20"
          onClick={() => onShare(site)}
          title="Share site location"
          aria-label="Share site location"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function SiteCardSkeleton() {
  return (
    <Card className="border-gold/20 overflow-hidden">
      <div className="aspect-video relative">
        <Skeleton className="absolute inset-0" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  )
}

// Helper function to truncate description
function getTruncatedDescription(description: string, wordCount = 25) {
  const words = description.split(" ")
  if (words.length <= wordCount) return description
  return words.slice(0, wordCount).join(" ") + "..."
}
