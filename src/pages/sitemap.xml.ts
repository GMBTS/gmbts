import dayjs from 'dayjs';
import { GetServerSideProps } from 'next/types';

import { prisma } from '@/db/prisma';
const EXTERNAL_DATA_URL = 'https://www.gmbts.com';

function generateSiteMap(complaints: { complaintId: string; createdAt: Date }[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <url>
       <loc>${EXTERNAL_DATA_URL}/feed</loc>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/heatmap</loc>
     </url>
     ${complaints
       .map(({ complaintId, createdAt }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/complaints/${complaintId}`}</loc>
           <lastmod>${dayjs(createdAt).format('YYYY-MM-DD')}</lastmod>

       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const complaints = await prisma.complaint.findMany({ select: { complaintId: true, createdAt: true } });

  const sitemap = generateSiteMap(complaints);

  res.setHeader('Content-Type', 'text/xml');

  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;
