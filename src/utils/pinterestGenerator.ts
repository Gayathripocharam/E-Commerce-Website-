import { Product } from '../data/products';

export interface PinterestVariation {
  title: string;
  description: string;
}

export interface GeneratedPins {
  variations: PinterestVariation[];
  keywords: string[];
}

export function generatePinterestVariations(product: Product): GeneratedPins {
  const brand = product.brand;
  const category = product.category;
  const price = product.discount_price.toLocaleString('en-IN');
  const originalPrice = product.price.toLocaleString('en-IN');
  const discountPercent = Math.round(((product.price - product.discount_price) / product.price) * 100);
  const color = product.color;
  const baseColor = color.split(' ')[0];
  const occasion = product.occasion;
  const style = product.style;
  const titleText = product.title;

  // 10 Titles
  const titles = [
    `Aesthetic ${color} ${category} Styling - Perfect for ${occasion} ✨`,
    `Best Amazon Fashion Finds: ${brand} ${category} Under ₹${price}`,
    `Viral ${style} Style Aesthetic - ${brand} ${category} Review`,
    `What to Wear to a ${occasion}: Stunning ${color} ${category} Outfit Idea`,
    `Chic Capsule Wardrobe Essentials: ${brand} ${style} ${category}`,
    `Minimalist ${color} ${category} Inspiration for Women`,
    `Amazon India Closet Steals: ${brand} ${category} at ${discountPercent}% Off`,
    `Perfect ${style} Outfit for University & Work Setup`,
    `How to Coordinate a ${color} ${category}: Aesthetic Guide`,
    `Daily HerCloset: Elegant ${brand} ${occasion} Look`
  ];

  // 10 Descriptions
  const descriptions = [
    `Obsessed with this gorgeous ${color.toLowerCase()} ${category.toLowerCase()} by ${brand}. The details are absolutely stunning and perfect for a ${occasion.toLowerCase()} look. Click to shop this Amazon India fashion find directly!`,
    `Looking for an affordable styling upgrade? This ${style.toLowerCase()} ${category.toLowerCase()} is under ₹${price} on Amazon. Extremely comfortable, breathable, and highly rated. Tap for the direct affiliate link!`,
    `The ultimate ${occasion.toLowerCase()} look! This ${brand} ${category.toLowerCase()} is crafted from beautiful material that drapes perfectly. Styled with matching coordinates, it makes a gorgeous statement. Check it out on Amazon India!`,
    `Get the ${style.toLowerCase()} look with this ${color.toLowerCase()} ${category.toLowerCase()}. Easily dressed up with heels or styled down for a casual day. See styling tips and buy directly on Amazon India.`,
    `Viral Amazon India fashion find! This ${brand} ${category.toLowerCase()} has been trending all over social media. Lightweight, stylish, and perfect for ${occasion.toLowerCase()} wear. Click the pin to shop!`,
    `Elevate your daily outfits with this classic ${baseColor.toLowerCase()} piece. Perfect for building a capsule wardrobe. Shop the Amazon sale deal now.`,
    `Honest review of the ${brand} ${category.toLowerCase()}. The fabric is super soft, fits true to size, and looks very premium. Under ₹${price} for a limited time. Tap to buy on Amazon India!`,
    `Perfect daily outfit inspiration. This comfortable and chic ${style.toLowerCase()} ${category.toLowerCase()} is an absolute staple for university or weekend brunches. Find the official affiliate link here!`,
    `Adding this beautiful ${brand} ${color.toLowerCase()} ${category.toLowerCase()} to my wishlist immediately! It makes the perfect gift or treat for yourself. Click through to Amazon to view sizes.`,
    `Aesthetic styling inspiration. This ${style.toLowerCase()} ${category.toLowerCase()} in ${color.toLowerCase()} is perfect for creating neutral, clean outfits. Shop this boutique pick on Amazon India today!`
  ];

  // 20 Keywords
  const baseKeywords = [
    category.toLowerCase(),
    `${category.toLowerCase()} designs`,
    `${category.toLowerCase()} outfits`,
    `${category.toLowerCase()} styling`,
    brand.toLowerCase(),
    `${baseColor.toLowerCase()} aesthetic`,
    `${baseColor.toLowerCase()} outfit`,
    `${occasion.toLowerCase()} wear`,
    `${occasion.toLowerCase()} outfit ideas`,
    `indian ${occasion.toLowerCase()} dress`,
    `${style.toLowerCase()} fashion`,
    `${style.toLowerCase()} aesthetic`,
    `${style.toLowerCase()} outfits`,
    `amazon fashion`,
    `amazon finds`,
    `amazon affiliate`,
    `amazon associates`,
    `aesthetic outfits`,
    `style inspo`,
    `capsule wardrobe`,
    `indian fashion`,
    `desi aesthetic`,
    `budget fashion`,
    `outfit ideas`,
    `clothing inspo`,
    `wardrobe essentials`,
    `ootd indian`
  ];

  // Remove duplicates and slice to exactly 20 keywords
  const uniqueKeywords = Array.from(new Set(baseKeywords)).slice(0, 20);

  const variations = titles.map((title, i) => ({
    title,
    description: descriptions[i]
  }));

  return {
    variations,
    keywords: uniqueKeywords
  };
}
