import { getProfile } from "./actions";
import ProfileForm from "@/components/forms/profile-form";

export default async function ProfilePage() {
  const user = await getProfile();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <ProfileForm user={user} />
    </div>
  );
}
