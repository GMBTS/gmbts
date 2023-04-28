import MoodBadIcon from '@mui/icons-material/MoodBad';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Divider,
  IconButton,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Complaint, User } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/db/prisma';

const FeedImage: React.FC<{ url: string; id: string; lazy: boolean }> = ({ url, id, lazy }) => {
  return (
    <div>
      <Link href={`/complaint/${id}`}>
        <Image
          style={{ objectFit: 'cover', textAlign: 'center' }}
          src={`/api/complaint/images/download?url=${url}`}
          loading={lazy ? 'lazy' : 'eager'}
          alt={`feed image ${id}`}
          width={700}
          height={400}
        />
      </Link>
    </div>
  );
};

const FeedItem = ({
  complaint,
  complaintIndex,
}: {
  complaint: Complaint & {
    Author: User;
  };
  complaintIndex: number;
}) => {
  return (
    <div
      style={{
        margin: '8px 0',
        border: 1,

        // display: 'flex',
      }}
    >
      <Card>
        <CardHeader
          avatar={<Avatar src={complaint.Author.image ?? undefined} alt={complaint.Author.name ?? undefined} />}
          title={complaint.Author.name}
          subheader={dayjs(complaint.createdAt).format('MMMM DD, YYYY HH:mm')}
        />
        <CardMedia
          component={FeedImage}
          url={complaint.images[0]}
          id={complaint.complaintId}
          lazy={complaintIndex !== 0}
        />
        <CardContent>
          <Typography paragraph variant="body1">
            {complaint.title}
          </Typography>
          <Typography variant="caption">{complaint.licensePlate}</Typography>
          <Typography
            paragraph
            variant="body2"
            color="text.secondary"
            style={{
              whiteSpace: 'pre-wrap',
            }}
          >
            {complaint.content}
          </Typography>
        </CardContent>
        <Divider />
        <CardActions disableSpacing style={{ flexDirection: 'row-reverse' }}>
          <IconButton aria-label="add to favorites">
            <MoodBadIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
};

const Feed: React.FC<{
  complaints: Array<Complaint & { Author: User }>;
}> = ({ complaints }) => {
  return (
    <div>
      <Typography style={{ textAlign: 'center' }} variant="h2">
        Feed
      </Typography>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 20,
          marginBottom: 36,
        }}
      >
        {complaints.map((complaint, complaintIndex) => (
          <FeedItem key={complaint.complaintId} complaint={complaint} complaintIndex={complaintIndex} />
        ))}
      </div>

      <div
        style={{ position: 'fixed', bottom: 0, backgroundColor: 'gray', width: '100%', padding: 8, borderRadius: '2%' }}
      >
        <Button component={Link} href="/complaint/create" variant="contained" style={{ marginLeft: 24 }}>
          + Create a new complaint
        </Button>
      </div>
    </div>
  );
};

export default Feed;

export async function getStaticProps() {
  const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' }, include: { Author: true } });

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
