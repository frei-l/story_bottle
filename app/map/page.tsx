import Navigation from "@/components/navigation";

export default function Home() {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between">
        <div className="relative w-full max-w-md h-[100dvh] overflow-hidden">
          <Navigation />
        </div>
      </main>
    )
  }
  