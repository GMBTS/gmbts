import MapIcon from '@mui/icons-material/Map';
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
import React, { useMemo } from 'react';

import { prisma } from '@/db/prisma';

const Ad = () => {
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
          avatar={<Avatar src="/icon-512x512.png" alt="website avatar" />}
          title="BMBTS"
          subheader="We need your help!"
        />
        <CardMedia
          component="img"
          height="194"
          image="https://images.idgesg.net/images/article/2019/07/teamwork_collaboration_leadership_development_developers_abstract_data_by_jay_yuno_gettyimages-1081869340_2400x1600-100802362-large.jpg?auto=webp&quality=85,70"
          alt="Paella dish"
        />
        <CardContent>
          <Typography paragraph variant="body1">
            Think you can help us? - We want the help!
          </Typography>
          <Typography variant="body2">Developer? Designer? Have an idea? We want to hear from you!</Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            href="mailto:avner.gmbts@gmail.com?subject=I want to help!"
            rel="noopener noreferrer"
            color="secondary"
          >
            Email Us
          </Button>
          <Button size="small" href="https://blog.gmbts.com" target="_blank" color="secondary">
            Learn More
          </Button>
          <Button size="small" href="https://github.com/GMBTS/gmbts" target="_blank" color="secondary">
            See Code
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

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
        aspectRatio: '16/9', // todo change area to origin image aspect ratio
        maxHeight: 500,
      }}
    >
      <Link href={`/complaint/${id}`} style={{ position: 'relative', height: '100%', width: '100%', display: 'block' }}>
        <Image
          style={{ objectFit: 'cover' }}
          src={`${cdnEndpoint}/${url}`}
          loading={lazy ? 'lazy' : 'eager'}
          alt={`feed image ${id}`}
          fill
          sizes="(max-width: 700px) 100vw, 700px"
          priority={!lazy}
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
    Author: User | null;
  };
  complaintIndex: number;
  cdnEndpoint: string;
}) => {
  const location = useMemo<{ latitude: number; longitude: number } | undefined>(
    () => (complaint?.location ? JSON.parse(complaint?.location) : undefined),
    [complaint?.location],
  );

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
          avatar={
            <Avatar src={complaint?.Author?.image ?? '/anonymous.png'} alt={complaint?.Author?.name ?? 'Anonymous'} />
          }
          title={complaint?.Author?.name ?? 'Anonymous'}
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
          <IconButton
            aria-label="go-to-map"
            LinkComponent="a"
            href={`http://www.google.com/maps/place/${location?.latitude},${location?.longitude}`}
            target="_blank"
          >
            <MapIcon />
          </IconButton>
          <IconButton aria-label="get-angry">
            <MoodBadIcon />
          </IconButton>
        </CardActions>
      </Card>
    </div>
  );
};

const Feed: React.FC<{
  complaints: Array<Complaint & { Author: User | null }>;
  cdnEndpoint: string;
}> = ({ complaints, cdnEndpoint }) => {
  return (
    <>
      <Head>
        <title>GMBTS | Sidewalk complaints feed</title>
        <meta name="description" content="Sidewalk complaints feed" />
        <meta property="og:title" content="Sidewalk complaints feed" />
        <meta property="og:description" content="GMBTS report when and where your sidewalk is take from you" />
        <meta property="og:image" content="https://gmbts.com/icon-256x256.png" />
        <meta property="og:url" content="https://gmbts.com/feed" />
        <meta property="og:type" content="article" />

        <meta property="twitter:image" content="https://gmbts.com/icon-512x512.png" />
        <meta property="twitter:title" content="Sidewalk complaints feed" />
        <meta property="twitter:description" content="GMBTS report when and where your sidewalk is take from you" />
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
            paddingBottom: 64,
          }}
        >
          {complaints.map((complaint, complaintIndex) => (
            <React.Fragment key={complaint.complaintId}>
              <FeedItem complaint={complaint} complaintIndex={complaintIndex} cdnEndpoint={cdnEndpoint} />
              {complaintIndex > 0 && (complaintIndex + 1) % 4 === 0 && <Ad />}
            </React.Fragment>
          ))}
        </div>

        <div
          style={{
            position: 'fixed',
            bottom: 0,
            backgroundColor: '#92bcea',
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
    Author: complaint.isAnonymous
      ? null
      : {
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
