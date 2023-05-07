import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Complaint } from '@prisma/client';
import Carousel from 'better-react-carousel';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { useDeleteComplaint } from '@/client/components/complaint/delete/hooks';
import { prisma } from '@/db/prisma';

const ViewComplaint: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  const { data: session } = useSession();
  const deleteComplaint = useDeleteComplaint();

  return (
    <div style={{ height: 'calc(100vh - 56px)', padding: 16 }}>
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
                    src={`/api/complaint/images/download?url=${image}`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    // property={index === 0}
                    width={400}
                    height={400}
                    alt="alt"
                    // placeholder="blur"
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
        {complaint.authorId === session?.user?.id && (
          <Button
            variant="contained"
            style={{ marginTop: 36, backgroundColor: 'red' }}
            onClick={() => deleteComplaint.mutateAsync({ complaintId: complaint.complaintId })}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
        <Button component={Link} variant="contained" color="secondary" href="/feed" style={{ marginTop: 36 }}>
          {`< Back to feed`}
        </Button>
        <Button component={Link} variant="contained" href="/complaint/create" style={{ marginTop: 36 }}>
          Create a new complaint
        </Button>
      </div>
    </div>
  );
};

export default ViewComplaint;

export const getStaticProps: GetStaticProps = async (context) => {
  const complaintId = context?.params?.complaintId;

  if (!complaintId || typeof complaintId !== 'string') {
    return {
      notFound: true,
    };
  }

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
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ complaintId: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};
