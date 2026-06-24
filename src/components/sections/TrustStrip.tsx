import {
  Heart,
  Building2,
  UtensilsCrossed,
  Cpu,
  Factory,
  ClipboardList,
  HardHat,
  ShoppingBag,
  Truck,
} from 'lucide-react';



const industries = [
  { label: 'Healthcare', icon: Heart },
  { label: 'Hospitality', icon: Building2 },
  { label: 'Food & Beverage', icon: UtensilsCrossed },
  { label: 'Information Technology', icon: Cpu },
  { label: 'Manufacturing', icon: Factory },
  { label: 'Administrative', icon: ClipboardList },
  { label: 'Construction', icon: HardHat },
  { label: 'Retail', icon: ShoppingBag },
  { label: 'Transportation', icon: Truck },
];

export default function TrustStrip() {
  const loop = [...industries, ...industries];

  return (
    <div className="w-full bg-forest py-6 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-2.5 mx-7 flex-shrink-0">
              <Icon size={15} className="text-gold" />
              <span className="text-cream text-[13px] uppercase tracking-[0.1em] font-medium">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

