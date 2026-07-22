import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Product Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'price', title: 'Price (PKR)', type: 'number' }),
    defineField({ name: 'compareAtPrice', title: 'Compare at Price', type: 'number' }),
    defineField({ name: 'images', title: 'Images', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'productType', title: 'Product Type', type: 'string' }),
    defineField({ name: 'vendor', title: 'Vendor / Brand', type: 'string' }),
    defineField({ name: 'status', title: 'Status', type: 'string', initialValue: 'active' }),
    defineField({ name: 'sizes', title: 'Sizes', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'colors', title: 'Colors', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'isAccessory', title: 'Is Accessory', type: 'boolean', initialValue: false }),
    defineField({
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
      description: 'Automatically updated count of approved customer reviews.',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'reviewAvg',
      title: 'Average Rating',
      type: 'number',
      description: 'Automatically updated average rating score (1-5).',
      initialValue: 0,
      readOnly: true,
    }),
  ],
});
