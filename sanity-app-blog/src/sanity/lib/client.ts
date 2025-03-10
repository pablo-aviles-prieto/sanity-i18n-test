import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/lib/api';

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
