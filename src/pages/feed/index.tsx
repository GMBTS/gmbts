import { Button, Typography } from '@mui/material';
import { Complaint, PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

const FeedImage: React.FC<{ url: string; id: string }> = ({ url, id }) => {
  return (
    <div>
      <Link href={`/complaint/${id}`}>
        <Image
          style={{ height: 400, objectFit: 'cover', textAlign: 'center', borderRadius: '4%' }}
          src={`/api/complaint/images/download?url=${url}`}
          loading="lazy"
          alt={`feed image ${id}`}
          width={400}
          height={400}
        />
      </Link>
    </div>
  );
};

const Feed: React.FC<{ complaints: Complaint[] }> = ({ complaints }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', height: '100vh', gap: 20 }}>
      <h1>Feed</h1>

      {complaints.map((complaint) => (
        <div
          key={complaint.complaintId}
          style={{
            margin: '8px 0',
            border: 1,
            gap: 30,
            display: 'flex',
          }}
        >
          <div style={{ padding: '24px 36px', border: 'solid', borderRadius: '4px', alignItems: 'flex-end' }}>
            {complaint.images.length > 0 && <FeedImage url={complaint.images[0]} id={complaint.complaintId} />}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'space-between', marginTop: 8 }}>
              <Typography variant="caption">{complaint.title}</Typography>
              <Typography variant="caption">{complaint.content}</Typography>
              <Typography variant="caption">{dayjs(complaint.createdAt).format('DD/MM/YYYY HH:mm')}</Typography>
            </div>
          </div>
        </div>
      ))}

      <Button component={Link} href="/complaint/create" variant="outlined">
        Create a new complaint
      </Button>
    </div>
  );
};

export default Feed;

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' } });

  const postsToReturn = complaints.map((complaint) => ({
    ...complaint,
    createdAt: complaint.createdAt.toISOString(),
  }));

  return {
    props: {
      complaints: postsToReturn,
    }, // will be passed to the page component as props
  };
}
