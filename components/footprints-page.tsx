"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FootprintsPage() {
  const [view, setView] = useState<"map" | "gallery">("map")

  const storyCards = [
    {
      id: "1",
      type: "romantic",
      color: "#FF6F61",
      text: "The old café where time stood still, and so did we.",
      location: "Downtown Café",
      date: "July 15",
      visits: 3,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      type: "memory",
      color: "#FFD166",
      text: "Echoes of laughter still bounce off these walls.",
      location: "Central Park",
      date: "July 10",
      visits: 5,
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      type: "fun",
      color: "#6FFFB0",
      text: "That spontaneous dance party under the city lights!",
      location: "City Square",
      date: "July 5",
      visits: 1,
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden">
      {/* Background with warm gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f8e9d6] to-[#ffd9c0]"></div>

      {/* Film grain texture overlay */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <div className="p-6 pb-0 relative z-10">
        <h1 className="text-2xl font-medium text-neutral-800 mb-4">My Footprints</h1>

        <Tabs defaultValue="map" className="w-full" onValueChange={(value) => setView(value as "map" | "gallery")}>
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-white/30 backdrop-blur-sm">
            <TabsTrigger value="map" className="data-[state=active]:bg-white/50">
              Map View
            </TabsTrigger>
            <TabsTrigger value="gallery" className="data-[state=active]:bg-white/50">
              Gallery
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-0">
            <div className="relative w-full h-[calc(100vh-200px)] rounded-lg overflow-hidden border border-white/50 shadow-lg">
              {/* Map with footprints */}
              <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=400')] bg-cover bg-center"></div>

              {/* Collage elements */}
              <div className="absolute top-10 right-10 w-20 h-24 bg-[url('/placeholder.svg?height=100&width=80')] rotate-6 opacity-60"></div>
              <div className="absolute bottom-20 left-10 w-24 h-16 bg-[url('/placeholder.svg?height=80&width=120')] -rotate-3 opacity-50"></div>

              {/* Brushstrokes */}
              {storyCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.7, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute rounded-full blur-md"
                  style={{
                    backgroundColor: card.color,
                    width: `${80 + card.visits * 10}px`,
                    height: `${40 + card.visits * 5}px`,
                    top: `${20 + index * 30}%`,
                    left: `${20 + index * 20}%`,
                    transform: `rotate(${index * 45}deg)`,
                  }}
                ></motion.div>
              ))}

              {/* Location pins with glow */}
              {storyCards.map((card, index) => (
                <div
                  key={`pin-${card.id}`}
                  className="absolute w-4 h-4 bg-white rounded-full border-2 border-neutral-800"
                  style={{
                    top: `${25 + index * 30}%`,
                    left: `${25 + index * 20}%`,
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-full blur-lg -z-10"
                    style={{ backgroundColor: card.color, opacity: 0.7 }}
                  ></div>
                </div>
              ))}

              {/* Handwritten notes */}
              {storyCards.map((card, index) => (
                <div
                  key={`note-${card.id}`}
                  className="absolute bg-white/80 backdrop-blur-sm p-2 rounded shadow-sm border border-white/50"
                  style={{
                    top: `${28 + index * 30}%`,
                    left: `${28 + index * 20}%`,
                    transform: `rotate(${(index % 2 === 0 ? 1 : -1) * 3}deg)`,
                    maxWidth: "120px",
                  }}
                >
                  <p className="font-caveat text-sm">{card.text.substring(0, 20)}...</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center">
              <Button className="bg-white/20 backdrop-blur-sm border border-white/50 text-neutral-800 hover:bg-white/30">
                <Download size={16} className="mr-2" />
                Generate Artistic Map
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="mt-0">
            <div className="grid gap-4 h-[calc(100vh-200px)] overflow-y-auto pb-6">
              {storyCards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-md overflow-hidden border border-white/50 transform rotate-0 hover:rotate-1 transition-transform"
                >
                  <div className="h-2 w-full" style={{ backgroundColor: card.color }}></div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{card.location}</h3>
                        <p className="text-sm text-neutral-500">{card.date}</p>
                      </div>
                      <div
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${card.color}20`,
                          color: card.color,
                        }}
                      >
                        #{card.type}
                      </div>
                    </div>

                    {/* Photo placeholder */}
                    <div className="w-full h-32 rounded-md overflow-hidden mb-3 relative">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.location}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>

                    <p className="font-caveat text-lg mb-3">{card.text}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {Array.from({ length: Math.min(card.visits, 3) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full mr-1"
                            style={{ backgroundColor: card.color }}
                          ></div>
                        ))}
                        {card.visits > 3 && <span className="text-xs text-neutral-500 ml-1">+{card.visits - 3}</span>}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
