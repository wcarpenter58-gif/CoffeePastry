import { PurchaseForm } from "@/components/purchase-form";
import { PurchaseHistory } from "@/components/purchase-history";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      {/* Decorative background element for aesthetic depth */}
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header */}
        <header className="mb-12 md:mb-16 text-center md:text-left">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary mb-3">
            Coffee Pastry
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
            Keep track of our rotating coffee runs. Select who paid and who was present. Simple as that.
          </p>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 relative z-10">
            <PurchaseForm />
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-5 relative z-10 flex flex-col pt-2 lg:pt-0">
            <PurchaseHistory />
          </div>

        </div>
      </div>
    </div>
  );
}
