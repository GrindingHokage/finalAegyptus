import Papa from "papaparse"

export interface SiteData {
  id: number
  name: string
  location: string
  distance: string
  description: string
  image: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Update the loadSitesData function to include the specific fallback images for each site
export async function loadSitesData(): Promise<SiteData[]> {
  try {
    // In a real app, this would be fetched from an API or static file
    const response = await fetch("/data/pharaonic-places.csv")
    const csvText = await response.text()

    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    })

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
        "https://www.traveltoegypt.net/front/images/blog/KomOmbo.jpg",
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
      "Temple of Esna": "https://nilecruisetrips.com/wp-content/uploads/2022/09/Esna-Temple-from-Luxor-1200x540.jpg",
      Ramesseum: "https://egymonuments.gov.eg/media/8507/whatsapp-image-2024-11-19-at-114258-am.jpeg",
      "Temple of Kalabsha": "https://nilecruisetrips.com/wp-content/uploads/2022/08/Temple-of-Kalabsha.jpg",
      "Pyramid of Meidum":
        "https://static1.thetravelimages.com/wordpress/wp-content/uploads/2023/11/aerial-view-of-ancient-ruins-ramesseum-luxor-egypt.jpg",
      "Temple of Hibis": "https://www.arabcont.com/Images/ProjectImage/habees16.jpg",
      // Default fallback for any other sites
      default: "https://batnomad.com/wp-content/uploads/2017/12/P1040401-1024x641.jpg",
    }

    return data.map((item: any, index: number) => {
      const siteName = item.Name || "Unknown Site"
      // Use specific image for the site if available, otherwise use the site's image URL or the default fallback
      const fallbackImage = siteFallbackImages[siteName] || siteFallbackImages.default

      return {
        id: index + 1,
        name: siteName,
        location: item.Location || "Egypt",
        distance: item.Distance ? `${item.Distance} km` : "Distance unknown",
        description: item["Short Description"] || "No description available",
        image: item["Image URL"] || fallbackImage,
        coordinates:
          item.Latitude && item.Longitude
            ? {
                lat: Number.parseFloat(item.Latitude),
                lng: Number.parseFloat(item.Longitude),
              }
            : undefined,
      }
    })
  } catch (error) {
    console.error("Error loading sites data:", error)
    return []
  }
}
