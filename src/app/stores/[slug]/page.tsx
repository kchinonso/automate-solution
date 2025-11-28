import { notFound } from 'next/navigation';
import dbConnect from '@/lib/mongodb';
import { Store } from '@/models/Store';
import StoreClient from './StoreClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PublicStorePage({ params }: PageProps) {
  const { slug } = await params;
  
  await dbConnect();
  
  const store = await Store.findOne({ 
    storeSlug: slug,
    isPublic: true 
  });

  if (!store) {
    notFound();
  }

  // Convert to plain object for client-side
  const storeData = JSON.parse(JSON.stringify(store));

  return <StoreClient store={storeData} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  
  await dbConnect();
  const store = await Store.findOne({ 
    storeSlug: slug,
    isPublic: true 
  });

  if (!store) {
    return {
      title: 'Store Not Found',
    };
  }

  return {
    title: `${store.storeName} - AutoMate Solutions Store`,
    description: store.storeDescription || `Welcome to ${store.storeName}'s online store`,
  };
}