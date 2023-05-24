import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Complaint } from '@prisma/client';
import Carousel from 'better-react-carousel';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useDeleteComplaint } from '@/client/components/complaint/delete/hooks';
import { prisma } from '@/db/prisma';

const ViewComplaint: React.FC<{ complaint: Complaint; cdnEndpoint: string }> = ({ complaint, cdnEndpoint }) => {
  const { data: session } = useSession();
  const deleteComplaint = useDeleteComplaint();
  const shareImage = `https://www.gmbts.com/_next/image?url=${encodeURIComponent(
    `${cdnEndpoint}/${complaint.images[0]}`,
  )}`;

  return (
    <>
      <Head>
        <title>GMBTS | complaints details</title>
        <meta property="og:title" content={complaint.title} />
        <meta name="description" content={complaint.content ?? ''} key="desc" />
        <meta property="og:description" content={complaint.content ?? ''} />
        <meta property="og:image" content={`${shareImage}&w=640&q=20`} />
        <meta property="og:url" content={`https://www.gmbts.com/complaint/${complaint.complaintId}`} />
        <meta property="og:type" content="article" />

        <meta property="twitter:image" content={`${shareImage}&w=640&q=45`} />
        <meta property="twitter:title" content={complaint.title} />
        <meta property="twitter:description" content="Twitter link preview description" />
      </Head>
      <div style={{ height: 'calc(100vh - 48px)', padding: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column' }} />
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>
            <IconButton size="large" color="inherit" component={Link} href="/feed">
              <ArrowBackIcon />
            </IconButton>
          </div>

          <Typography style={{ textAlign: 'center', padding: 24, flex: '1', marginRight: 48 }} variant="h4">
            {complaint.title}
          </Typography>
        </div>

        <div id="content" style={{ width: '100%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1">Content:</Typography>
            &nbsp;
            <Typography variant="caption">{complaint.content}</Typography>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body1">License plate:</Typography>
            &nbsp;
            <Typography variant="caption">{complaint.licensePlate}</Typography>
          </div>

          <div style={{ margin: '32px 0' }}>
            <Carousel
              loop
              cols={2}
              showDots
              responsiveLayout={[
                { breakpoint: 1250, cols: 2, gap: 2 },
                { breakpoint: 1000, cols: 4, rows: 1, gap: 2 },
              ]}
              mobileBreakpoint={600}
            >
              {complaint.images.length > 0 &&
                complaint.images.map((image, index) => (
                  <Carousel.Item key={image}>
                    <Image
                      style={{ height: 400, objectFit: 'cover', textAlign: 'center', borderRadius: '4%' }}
                      src={`${cdnEndpoint}/${image}`}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      width={400}
                      height={400}
                      alt="alt"
                    />
                  </Carousel.Item>
                ))}
            </Carousel>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          {complaint.authorId === session?.user?.id && (
            <>
              <Button
                component={Link}
                variant="contained"
                href={`/complaint/${complaint.complaintId}/edit`}
                style={{ marginTop: 36 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                style={{ marginTop: 36, backgroundColor: '#AFB3F7' }}
                onClick={() => deleteComplaint.mutateAsync({ complaintId: complaint.complaintId })}
              >
                <DeleteIcon fontSize="small" />
                Delete
              </Button>
            </>
          )}
          <Button component={Link} variant="contained" color="secondary" href="/feed" style={{ marginTop: 36 }}>
            {`< Back to feed`}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewComplaint;

export const getStaticProps: GetStaticProps = async (context) => {
  const complaintId = context?.params?.complaintId;
  const cdnEndpoint = process.env.CDN_ENDPOINT; // this is silly - i can pass it ad env var with the SSR

  if (!complaintId || typeof complaintId !== 'string') {
    return {
      notFound: true,
    };
  }

  try {
    const complaint = await prisma.complaint.findUnique({
      where: {
        complaintId,
      },
    });

    if (!complaint) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        complaint: {
          ...complaint, /// todo add this to react-query context
          createdAt: complaint.createdAt.toISOString(),
        },
        cdnEndpoint,
      },
    };
  } catch (error) {
    console.error(error);
    throw new Error('There is a problem with the server. Please try again later.');
  }

  return {
    notFound: true,
  };
};

export const getStaticPaths: GetStaticPaths<{ complaintId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
