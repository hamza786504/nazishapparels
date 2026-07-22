import { defineField, defineType } from 'sanity';

export const review = defineType({
  name: 'review',
  title: 'Customer Review',
  type: 'document',
  fields: [
    defineField({
      name: 'productId',
      title: 'Product ID',
      type: 'string',
      description: 'ID of the product this review belongs to',
    }),
    defineField({
      name: 'product',
      title: 'Product Reference',
      type: 'reference',
      to: [{ type: 'product' }],
    }),
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string' }),
    defineField({ name: 'email', title: 'Customer Email', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Rating (1 to 5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).required(),
    }),
    defineField({ name: 'title', title: 'Review Headline', type: 'string' }),
    defineField({ name: 'comment', title: 'Review Comment', type: 'text' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Approval', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
    }),
  ],
});
