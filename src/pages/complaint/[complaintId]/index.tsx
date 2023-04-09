import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Complaint } from '@prisma/client';
import Carousel from 'better-react-carousel';
import Link from 'next/link';

import { prisma } from '@/db/prisma';

const ViewComplaint: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  return (
    <div style={{ height: '100vh', padding: 16 }}>
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
              complaint.images.map((image) => (
                <Carousel.Item>
                  <img
                    style={{ height: 400, objectFit: 'cover', textAlign: 'center', borderRadius: '4%' }}
                    src={`/api/complaint/images/download?url=${image}`}
                    loading="lazy"
                  />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
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

// todo check what is the real type here
export async function getServerSideProps(ctx: any) {
  const complaintId = ctx.query.complaintId;
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
}
