import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProductLoading() {
  return (
    <main className="flex-1 min-w-0 overflow-y-auto pb-8">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-2 animate-pulse">
        
        {/* Breadcrumbs Skeleton */}
        <nav className="flex items-center gap-2 mb-2">
          <div className="w-12 h-4 bg-gray-200 rounded"></div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <div className="w-32 h-4 bg-gray-200 rounded"></div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Image Gallery Skeleton */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row-reverse gap-4">
              {/* Main Image Skeleton */}
              <div className="flex-1 max-h-[550px] aspect-[3/4] bg-gray-200 rounded-sm"></div>
              
              {/* Thumbnails Skeleton */}
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-20 lg:w-24 shrink-0">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 md:w-full aspect-[3/4] bg-gray-200 rounded-sm shrink-0"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="lg:col-span-5 flex flex-col pt-2 lg:pl-4 xl:pl-8">
            <div className="w-24 h-4 bg-gray-200 rounded mb-4"></div>
            <div className="w-3/4 h-8 bg-gray-200 rounded mb-4"></div>
            <div className="w-32 h-6 bg-gray-200 rounded mb-6"></div>
            
            <div className="space-y-3 mb-8">
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="w-5/6 h-4 bg-gray-200 rounded"></div>
              <div className="w-4/6 h-4 bg-gray-200 rounded"></div>
            </div>
            
            <div className="w-20 h-4 bg-gray-200 rounded mb-3"></div>
            <div className="flex gap-3 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-12 h-12 bg-gray-200 rounded-full"></div>
              ))}
            </div>

            <div className="flex gap-4 mt-4">
              <div className="w-32 h-14 bg-gray-200 rounded-sm"></div>
              <div className="flex-1 h-14 bg-gray-200 rounded-sm"></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
