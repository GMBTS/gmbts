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
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import { prisma } from '@/db/prisma';

const FeedImage: React.FC<{ url: string; id: string; lazy: boolean; cdnEndpoint: string }> = ({
  url,
  id,
  lazy,
  cdnEndpoint,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 700,
        aspectRatio: '16/9',
        maxHeight: 500,
      }}
    >
      <Link href={`/complaint/${id}`}>
        <Image
          style={{ objectFit: 'cover' }}
          src={`${cdnEndpoint}/${url}`}
          loading={lazy ? 'lazy' : 'eager'}
          alt={`feed image ${id}`}
          fill
          sizes="(max-width: 700px) 100vw, 700px"
        />
      </Link>
    </div>
  );
};

const FeedItem = ({
  complaint,
  complaintIndex,
  cdnEndpoint,
}: {
  complaint: Complaint & {
    Author: User;
  };
  complaintIndex: number;
  cdnEndpoint: string;
}) => {
  return (
    <div
      style={{
        margin: '8px 0',
        border: 1,
        width: '100%',
      }}
    >
      <Card style={{ width: '90%', margin: 'auto', maxWidth: 700 }}>
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
          cdnEndpoint={cdnEndpoint}
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
  cdnEndpoint: string;
}> = ({ complaints, cdnEndpoint }) => {
  return (
    <>
      <Head>
        <title>Sidewalk complaints feed</title>
      </Head>
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
            <FeedItem
              key={complaint.complaintId}
              complaint={complaint}
              complaintIndex={complaintIndex}
              cdnEndpoint={cdnEndpoint}
            />
          ))}
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: 0,
            backgroundColor: 'gray',
            width: '100%',
            padding: 8,
            borderRadius: '2%',
          }}
        >
          <Button component={Link} href="/complaint/create" variant="contained" style={{ marginLeft: 24 }}>
            + Create a new complaint
          </Button>
        </div>
      </div>
    </>
  );
};

export default Feed;

export async function getStaticProps() {
  const complaints = await prisma.complaint.findMany({ orderBy: { createdAt: 'desc' }, include: { Author: true } });
  const cdnEndpoint = process.env.CDN_ENDPOINT;

  const postsToReturn = complaints.map((complaint) => ({
    ...complaint,
    createdAt: complaint.createdAt.toISOString(),
    Author: {
      ...complaint.Author,
      createdAt: complaint.Author.createdAt.toISOString(),
    },
  }));

  return {
    props: {
      complaints: postsToReturn,
      cdnEndpoint, // todo find better way to pass this
    },
  };
}
