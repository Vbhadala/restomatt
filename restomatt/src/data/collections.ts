export interface CollectionImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  heroImage: string;
  images: CollectionImage[];
  features: string[];
  priceRange: string;
  deliveryTime: string;
  materials: string[];
  customizable: boolean;
  popular: boolean;
}

export const collections: Collection[] = [
  {
    id: 'modern-kitchens',
    title: 'Modern Kitchens',
    slug: 'modern-kitchens',
    description: 'Transform your cooking space with our contemporary kitchen designs. Our modern kitchens combine functionality with stunning aesthetics, featuring clean lines, premium materials, and innovative storage solutions. Each kitchen is custom-designed to maximize your space while reflecting your personal style.',
    shortDescription: 'Custom kitchen cabinets and modular designs',
    heroImage: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern white kitchen with island',
        caption: 'Sleek white kitchen with marble countertops'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Contemporary kitchen with dark cabinets',
        caption: 'Dark wood cabinets with modern appliances'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Open concept kitchen design',
        caption: 'Open concept kitchen with breakfast bar'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Luxury kitchen with pendant lights',
        caption: 'Luxury kitchen with designer pendant lighting'
      }
    ],
    features: [
      'Custom cabinet design',
      'Premium countertops',
      'Soft-close drawers',
      'Built-in appliances',
      'LED lighting',
      'Smart storage solutions'
    ],
    priceRange: '₹2,50,000 - ₹8,00,000',
    deliveryTime: '4-6 weeks',
    materials: ['Oak Wood', 'Maple Wood', 'Laminate', 'Quartz', 'Granite'],
    customizable: true,
    popular: true
  },
  {
    id: 'luxury-sofas',
    title: 'Luxury Sofas',
    slug: 'luxury-sofas',
    description: 'Experience ultimate comfort with our luxury sofa collection. Handcrafted with premium materials and attention to detail, our sofas are designed to be the centerpiece of your living room. Choose from various styles, fabrics, and configurations to match your lifestyle.',
    shortDescription: 'Comfortable seating solutions for your living room',
    heroImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Luxury leather sofa set',
        caption: 'Premium leather sofa with ottoman'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern fabric sectional',
        caption: 'Contemporary sectional sofa in neutral tones'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Elegant living room setup',
        caption: 'Elegant sofa arrangement with accent pillows'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/2062431/pexels-photo-2062431.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Minimalist sofa design',
        caption: 'Minimalist sofa with clean lines'
      }
    ],
    features: [
      'Premium upholstery',
      'Solid wood frame',
      'High-density foam',
      'Customizable configurations',
      'Stain-resistant fabric',
      '10-year warranty'
    ],
    priceRange: '₹80,000 - ₹3,50,000',
    deliveryTime: '3-4 weeks',
    materials: ['Leather', 'Fabric', 'Velvet', 'Linen'],
    customizable: true,
    popular: true
  },
  {
    id: 'bedroom-sets',
    title: 'Bedroom Sets',
    slug: 'bedroom-sets',
    description: 'Create your perfect sanctuary with our complete bedroom furniture sets. From elegant bed frames to spacious wardrobes, our bedroom collections combine style and functionality to give you the restful space you deserve.',
    shortDescription: 'Complete bedroom furniture with wardrobes',
    heroImage: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern bedroom set',
        caption: 'Complete modern bedroom with wardrobe'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Elegant master bedroom',
        caption: 'Elegant master bedroom with walk-in closet'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Minimalist bedroom design',
        caption: 'Minimalist bedroom with built-in storage'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Luxury bedroom suite',
        caption: 'Luxury bedroom suite with premium finishes'
      }
    ],
    features: [
      'Complete bedroom set',
      'Built-in wardrobes',
      'Under-bed storage',
      'Matching nightstands',
      'Premium wood finish',
      'Soft-close mechanisms'
    ],
    priceRange: '₹1,20,000 - ₹5,00,000',
    deliveryTime: '5-7 weeks',
    materials: ['Pine Wood', 'MDF', 'Plywood', 'Veneer'],
    customizable: true,
    popular: false
  },
  {
    id: 'office-furniture',
    title: 'Office Furniture',
    slug: 'office-furniture',
    description: 'Boost your productivity with our professional office furniture collection. Designed for comfort and efficiency, our office solutions include ergonomic desks, storage units, and seating that create an inspiring work environment.',
    shortDescription: 'Professional workspace solutions',
    heroImage: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern office setup',
        caption: 'Modern office desk with storage solutions'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Executive office design',
        caption: 'Executive office with premium furniture'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Home office workspace',
        caption: 'Compact home office solution'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Conference room furniture',
        caption: 'Conference room with custom table'
      }
    ],
    features: [
      'Ergonomic design',
      'Cable management',
      'Adjustable height',
      'Ample storage',
      'Durable construction',
      'Professional finish'
    ],
    priceRange: '₹50,000 - ₹2,50,000',
    deliveryTime: '2-3 weeks',
    materials: ['Engineered Wood', 'Metal', 'Glass', 'Leather'],
    customizable: true,
    popular: false
  },
  {
    id: 'dining-sets',
    title: 'Dining Sets',
    slug: 'dining-sets',
    description: 'Gather your loved ones around our beautiful dining sets. From intimate 4-seater arrangements to grand 12-seater tables, our dining furniture combines durability with timeless design to create memorable dining experiences.',
    shortDescription: 'Elegant dining tables and chairs',
    heroImage: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Elegant dining room set',
        caption: 'Elegant dining set for family gatherings'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modern dining table',
        caption: 'Modern dining table with upholstered chairs'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Rustic dining setup',
        caption: 'Rustic dining table with bench seating'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Contemporary dining room',
        caption: 'Contemporary dining room with pendant lighting'
      }
    ],
    features: [
      'Solid wood construction',
      'Expandable options',
      'Comfortable seating',
      'Scratch-resistant finish',
      'Easy maintenance',
      'Various sizes available'
    ],
    priceRange: '₹60,000 - ₹3,00,000',
    deliveryTime: '3-5 weeks',
    materials: ['Teak Wood', 'Sheesham', 'Oak', 'Mango Wood'],
    customizable: true,
    popular: false
  },
  {
    id: 'storage-solutions',
    title: 'Storage Solutions',
    slug: 'storage-solutions',
    description: 'Maximize your space with our innovative storage solutions. From built-in wardrobes to modular shelving systems, our storage furniture helps you organize your home while maintaining a clean, clutter-free aesthetic.',
    shortDescription: 'Custom storage and organization furniture',
    heroImage: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200',
    images: [
      {
        id: '1',
        url: 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Built-in storage solutions',
        caption: 'Built-in storage maximizing space efficiency'
      },
      {
        id: '2',
        url: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Modular shelving system',
        caption: 'Modular shelving for flexible organization'
      },
      {
        id: '3',
        url: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Walk-in closet design',
        caption: 'Custom walk-in closet with premium fittings'
      },
      {
        id: '4',
        url: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=1200',
        alt: 'Multi-purpose storage',
        caption: 'Multi-purpose storage with hidden compartments'
      }
    ],
    features: [
      'Space optimization',
      'Modular design',
      'Hidden storage',
      'Easy access',
      'Durable materials',
      'Custom configurations'
    ],
    priceRange: '₹40,000 - ₹2,00,000',
    deliveryTime: '2-4 weeks',
    materials: ['Plywood', 'MDF', 'Particle Board', 'Metal Fittings'],
    customizable: true,
    popular: false
  }
];