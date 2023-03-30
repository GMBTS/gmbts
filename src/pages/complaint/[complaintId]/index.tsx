import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { Complaint, PrismaClient } from '@prisma/client';
import Link from 'next/link';

const ViewComplaint: React.FC<{ complaint: Complaint }> = ({ complaint }) => {
  console.log(complaint);
  return (
    <div style={{ height: '100vh', padding: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column' }} />
      <Typography variant="h4">{complaint.title}</Typography>

      <div id="content" style={{ width: '100%', textAlign: 'center' }}>
        <div>
          <Typography variant="body1">Content:</Typography>
          <Typography>{complaint.content}</Typography>
        </div>

        <div>
          <Typography variant="body1">licensePlate:</Typography>
          <Typography>{complaint.licensePlate}</Typography>
        </div>

        {complaint.images.length > 0 &&
          complaint.images.map((image) => (
            <div>
              <img
                style={{ height: 400, objectFit: 'cover', textAlign: 'center', borderRadius: '4%' }}
                src={`/api/complaint/images/download?url=${image}`}
                loading="lazy"
              />
            </div>
          ))}
      </div>

      <Button component={Link} variant="contained" href="/complaint/create" style={{ marginTop: 36 }}>
        Create a new complaint
      </Button>
      <Button component={Link} variant="contained" color="secondary" href="/feed" style={{ marginTop: 36 }}>
        {`< Back to feed`}
      </Button>
    </div>
  );
};

export default ViewComplaint;

// todo check what is the real type here
export async function getServerSideProps(ctx: any) {
  const complaintId = ctx.query.complaintId;
  const prisma = new PrismaClient();
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
        ...complaint,
        createdAt: complaint.createdAt.toISOString(),
      },
    },
  };
}
