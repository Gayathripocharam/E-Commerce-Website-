export interface Product {
  id: string;
  title: string;
  amazon_asin: string;
  affiliate_url: string;
  price: number;
  discount_price: number;
  brand: string;
  category: 'Dresses' | 'Kurtis' | 'Sarees' | 'Tops' | 'Bottom Wear' | 'Footwear' | 'Handbags' | 'Jewelry' | 'Beauty';
  description: string;
  image_urls: string[];
  rating: number;
  occasion: 'Wedding' | 'Festival' | 'Casual' | 'Office' | 'Summer' | 'Party';
  style: 'Traditional' | 'Glamorous' | 'Chic' | 'Casual' | 'Professional' | 'Boho';
  color: string;
  collections: ('Trending Today' | 'Summer Collection' | 'Wedding Collection' | 'Office Wear' | 'Casual Wear' | 'Festival Collection' | 'Under ₹999' | 'Premium Collection')[];
  pinterestTitle: string;
  pinterestDescription: string;
  pinterestKeywords: string[];
}

export const products: Product[] = [
  {
    id: "top-co-ord",
    title: "Blue Paisley Halter Top & Skirt Co-Ord Set",
    amazon_asin: "B09XHALT",
    affiliate_url: "https://www.amazon.in/dp/B09XHALT?tag=HerCloset0d-21",
    price: 2499,
    discount_price: 1290,
    brand: "Boho Chic",
    category: "Dresses",
    description: "A gorgeous blue paisley halter crop top and matching wrap-around maxi skirt. The perfect summer look! It’s the ultimate combination of comfort and boho-chic style, making it perfect for your next vacation, beach day, or casual resort look.",
    image_urls: [
      "https://i.pinimg.com/736x/67/26/a5/6726a51259ffcb2c35847724be1f7901.jpg"
    ],
    rating: 4.5,
    occasion: "Summer",
    style: "Boho",
    color: "Blue Paisley",
    collections: ["Trending Today", "Summer Collection", "Premium Collection"],
    pinterestTitle: "Best Halter Neck Top and Summer Outfit | Boho Vacation Style",
    pinterestDescription: "The perfect summer look doesn't exi— 😍 Say hello to your new favorite outfit! We are completely obsessed with the effortless movement of this gorgeous blue paisley halter crop top and matching wrap-around maxi skirt.",
    pinterestKeywords: ["halter top", "summer outfit", "boho style", "vacation wear", "co-ord set"]
  },
  {
    id: "short-kurti",
    title: "Cotton Floral Print Short Kurti Tunic",
    amazon_asin: "B09XSHORTK",
    affiliate_url: "https://www.amazon.in/dp/B09XSHORTK?tag=HerCloset0d-21",
    price: 1499,
    discount_price: 699,
    brand: "Vanya Traditions",
    category: "Kurtis",
    description: "An everyday cotton floral print short kurti tunic designed for modern comfort. Style it with denims or ethnic flat slip-ons for campus style.",
    image_urls: [
      "https://i.pinimg.com/736x/d3/7f/77/d37f7751fbf5055b55eb61fa2798a03e.jpg"
    ],
    rating: 4.3,
    occasion: "Casual",
    style: "Traditional",
    color: "Printed Cotton",
    collections: ["Casual Wear", "Summer Collection", "Under ₹999"],
    pinterestTitle: "Trendy Short Cotton Kurti for Women | College Style Inspo",
    pinterestDescription: "Kurti, short kurti styling inspiration. Soft, breathable cotton kurti perfect for campus wear and daily styling.",
    pinterestKeywords: ["short kurti", "cotton kurti", "college style", "ethnic wear", "amazon fashion finds"]
  },
  {
    id: "coastal-paisley-dress",
    title: "Coastal Paisley Halter Midi Dress",
    amazon_asin: "B09SDPAISLEY",
    affiliate_url: "https://amzn.to/4dTpRVd",
    price: 2999,
    discount_price: 1490,
    brand: "TrendBelle",
    category: "Dresses",
    description: "A stunning bohemian-chic strapless halter beach dress featuring a colorful paisley block pattern. Crafted from lightweight, breathable fabric, with an asymmetrical tiered ruffle hems. Perfect for hot summer getaways, beach walks, resort lounging, and tropical vacation styling.",
    image_urls: [
      "https://i.pinimg.com/736x/3b/ac/47/3bac475b33796eeb75b042e2927839d5.jpg"
    ],
    rating: 4.6,
    occasion: "Summer",
    style: "Boho",
    color: "Pink & Blue",
    collections: ["Summer Collection", "Casual Wear", "Trending Today", "Premium Collection"],
    pinterestTitle: "Coastal Paisley Halter Midi Dress | Summer Vacation Outfit",
    pinterestDescription: "The Coastal Paisley Halter Midi Dress brings effortless bohemian energy to your sunny day plans! A self-tie halter neckline and a smocked, strapless bodice meet an asymmetrical handkerchief hemline for a breezy, flowing fit.",
    pinterestKeywords: ["beach dress", "boho dress", "vacation outfit", "summer fashion", "resort wear", "women dress", "amazon fashion"]
  },
  {
    id: "ivory-co-ord",
    title: "Ivory Meadow Embroidered Cotton Co-Ord Set",
    amazon_asin: "B09XIVORYC",
    affiliate_url: "https://www.amazon.in/dp/B09XIVORYC?tag=HerCloset0d-21",
    price: 3499,
    discount_price: 1890,
    brand: "Vanya Traditions",
    category: "Kurtis",
    description: "A premium cotton co-ord set featuring delicate floral embroidery and mirror-work details. Includes a tunic with side slits and comfortable matching wide-leg trousers.",
    image_urls: [
      "https://i.pinimg.com/736x/9a/96/ec/9a96ec750fb8c9de4a19bae4a17383fa.jpg"
    ],
    rating: 4.7,
    occasion: "Office",
    style: "Traditional",
    color: "Beige & Ivory",
    collections: ["Trending Today", "Office Wear", "Festival Collection"],
    pinterestTitle: "Ivory Meadow Embroidered Co-Ord Set | Premium Cotton Wear",
    pinterestDescription: "The Ivory Meadow Embroidered Co-Ord Set brings easy, understated elegance to your daily plans! Delicate floral embroidery and mirror-work details meet adjustable spaghetti straps and an easy, wide-leg trouser cut.",
    pinterestKeywords: ["cotton co-ord", "embroidered set", "ethnic co-ord", "traditional wear", "office style"]
  },
  {
    id: "linen-trousers",
    title: "Oasis Linen-Blend Wide-Leg Trousers",
    amazon_asin: "B09SDLINENPANTS",
    affiliate_url: "https://amzn.to/4e34Sj7",
    price: 2499,
    discount_price: 1190,
    brand: "ChicBoard",
    category: "Bottom Wear",
    description: "Coastal sophistication. Structured high-rise linen-blend trousers featuring a comfortable elastic waistband, drawstring tie, and deep side pockets.",
    image_urls: [
      "https://i.pinimg.com/736x/84/5d/61/845d61f13dcb8ff440c6e04274abef50.jpg"
    ],
    rating: 4.5,
    occasion: "Summer",
    style: "Boho",
    color: "Oatmeal Natural",
    collections: ["Summer Collection", "Casual Wear", "Trending Today"],
    pinterestTitle: "Linen-Blend Wide-Leg Trousers | Breezy Summer Outfits",
    pinterestDescription: "The Oasis Linen-Blend Wide-Leg Trousers bring effortless coastal sophistication to your sunny day plans! A comfortable high-rise elastic waistband with an adjustable drawstring tie meets a relaxed, wide-leg silhouette.",
    pinterestKeywords: ["linen pants", "wide leg pants", "summer trousers", "vacation wear", "coastal style"]
  },
  {
    id: "midnight-bloom-dress",
    title: "Midnight Bloom High-Low Maxi Dress",
    amazon_asin: "B09SDFLORAL",
    affiliate_url: "https://amzn.to/3SdVkdw",
    price: 2499,
    discount_price: 1290,
    brand: "TrendBelle",
    category: "Dresses",
    description: "Elegant black floral high-low maxi dress featuring soft, breathable organic cotton, comfortable elasticized waistline, and an aesthetic tiered high-low cascade. Perfect for summer outings, beach walks, weekend brunches, and vacation styling.",
    image_urls: [
      "https://i.pinimg.com/736x/de/8a/fe/de8afea365ab75670d80f1700355d474.jpg"
    ],
    rating: 4.7,
    occasion: "Summer",
    style: "Boho",
    color: "Black Floral",
    collections: ["Summer Collection", "Casual Wear", "Trending Today", "Premium Collection"],
    pinterestTitle: "Midnight Bloom High-Low Dress | Black Floral Maxi",
    pinterestDescription: "The Midnight Bloom High-Low Dress brings effortless elegance to every occasion! A graceful sleeveless silhouette and flowing high-low hem combine with a striking black base and oversized floral print.",
    pinterestKeywords: ["floral maxi dress", "high low dress", "summer dress", "vacation outfit", "amazon finds"]
  },
  {
    id: "sunshine-blossom-dress",
    title: "Sunshine Blossom Backless Mini Dress",
    amazon_asin: "B08W1LK76B",
    affiliate_url: "https://www.amazon.in/dp/B08W1LK76B?tag=HerCloset0d-21",
    price: 1899,
    discount_price: 949,
    brand: "TrendBelle",
    category: "Dresses",
    description: "Your ultimate summer aesthetic. A flowy tiered organic cotton mini sundress featuring bright floral prints, a cute sweetheart neckline, adjustable shoulder straps, and a clean open back.",
    image_urls: [
      "https://i.pinimg.com/736x/07/cd/66/07cd669f1962a08c0d0db84531dfa146.jpg"
    ],
    rating: 4.4,
    occasion: "Summer",
    style: "Boho",
    color: "Yellow Floral",
    collections: ["Summer Collection", "Casual Wear", "Under ₹999"],
    pinterestTitle: "Sunshine Blossom Backless Mini Dress | Summer Party Wear",
    pinterestDescription: "The Sunshine Blossom Backless Mini Dress brings carefree summer vibes and feminine elegance to every sunny-day outing! Designed with delicate spaghetti straps, a flattering fit-and-flare silhouette.",
    pinterestKeywords: ["mini dress", "floral dress", "backless dress", "summer party", "beach outfit"]
  }
];
