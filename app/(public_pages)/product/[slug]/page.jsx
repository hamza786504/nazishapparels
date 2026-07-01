import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

// ISR: Revalidate cached product detail pages every 10 minutes (600s)
export const revalidate = 600;

// Generate pages on-demand for slugs not pre-rendered during build
export const dynamicParams = true;

// Pre-render the top 20 active products at build time to speed up deployment builds
export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({ status: 'active' })
      .limit(20)
      .select('slug')
      .lean();
    
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params for products:', error);
    return [];
  }
}

// Fetch single product details directly from MongoDB on the server
async function getProduct(slug) {
  try {
    await dbConnect();
    const product = await Product.findOne({ slug }).lean();
    if (!product) return null;
    
    // Safely serialize MongoDB ObjectIDs and Date objects to plain JSON for client props
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error(`Error loading product slug "${slug}":`, error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <ProductPageClient initialProduct={product} />;
}