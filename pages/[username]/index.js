import UserProfile from '../../components/UserProfile';
import { getUserWithUsername } from '../../lib/firebase';

export async function getServerSideProps({ query }) {
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page.
  if (!userDoc) {
    return {
      notFound: true
    };
  }

  // JSON serializable data
  let user = null;

  if (userDoc) {
    user = userDoc.data();
  }

  return {
    props: { user }, // Will be passed to the page component as props
  };
}

export default function UserProfilePage({ user }) {
  return (
    <div>
      <UserProfile user={user} />
    </div>
  );
}
