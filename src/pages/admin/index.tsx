import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { Account, Complaint, User } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { prisma } from '@/db/prisma';

export default function AdminPage({
  users,
}: {
  users: (User & {
    accounts: Account[];
    AuthorComplainets: Complaint[];
  })[];
}) {
  console.log(users);

  return (
    <div style={{ height: '100vh' }}>
      <Typography variant="h3" style={{ textAlign: 'center' }}>
        Admin Page
      </Typography>

      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 5 }}>
        Users:
      </Typography>
      {/* <Divider variant="inset" /> */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <div style={{ width: '100%', maxWidth: 560, backgroundColor: '' }}>
          {users.map((user, index) => (
            <Accordion sx={{ width: '100%', maxWidth: 550, bgcolor: 'background.paper' }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
                <Avatar alt={user.name ?? ''} src={user.image ?? undefined} style={{ alignSelf: 'center' }} />

                <ListItemText
                  style={{ marginLeft: '10px' }}
                  primary={user.name ?? 'No name'}
                  secondary={
                    <>
                      <Typography sx={{ display: 'inline' }} component="span" variant="caption" color="text.secondary">
                        ID:{` ${user.id}`}
                      </Typography>
                      <Typography
                        sx={{ display: 'inline', marginLeft: 1 }}
                        component="span"
                        variant="caption"
                        color="text.secondary"
                      >
                        Account's list ({`${user.accounts.length}`}):{' '}
                        {user.accounts.map((account) => account.provider).join(', ')}
                      </Typography>
                    </>
                  }
                />
              </AccordionSummary>
              <AccordionDetails>
                <List sx={{ width: '100%', maxWidth: 540, bgcolor: 'background.paper' }}>
                  {user.AuthorComplainets.map((complaint, index) => (
                    <>
                      {index !== 0 && <Divider variant="inset" />}

                      <ListItem alignItems="flex-start" component={Link} href="">
                        <ListItemAvatar>
                          <Avatar alt={complaint.title}>
                            <Image
                              src={`https://dkuv4ptlgt9yb.cloudfront.net/${complaint.images[0]}`}
                              width={56}
                              height={56}
                              alt={complaint.title}
                            />
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={complaint.title}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {complaint.licensePlate}
                              </Typography>{' '}
                              {complaint.content}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    </>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const users = await prisma.user.findMany({
    include: {
      AuthorComplainets: true,
      accounts: true,
    },
  });

  const serializedUsers = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    AuthorComplainets: user.AuthorComplainets.map((complaint) => ({
      ...complaint,
      createdAt: complaint.createdAt.toISOString(),
    })),
    accounts: user.accounts.map((account) => ({
      ...account,
      createdAt: account.createdAt.toISOString(),
    })),
  }));

  return {
    props: {
      users: serializedUsers,
    },
  };
}
