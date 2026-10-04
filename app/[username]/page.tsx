import Image from "next/image";
import { notFound } from "next/navigation";
import { OwnEvents } from "@/app/[username]/own-events";
import { ProfileForm } from "@/app/[username]/profile-form";
import { getCurrentUser } from "@/lib/current-user";
import { getPublicProfile } from "@/lib/users";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = getPublicProfile(username);
  if (!profile) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isOwner = currentUser?.id === profile.id;
  const pictureSrc = profile.hasProfilePicture
    ? `/avatars/${profile.id}?v=${profile.pictureVersion}`
    : null;

  return (
    <main className="mx-auto flex w-full max-w-lg flex-col gap-8 px-6 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        {profile.username}
      </h1>
      <dl className="flex flex-col gap-4">
        <div>
          <dt className="text-sm">Name</dt>
          <dd>{profile.name}</dd>
        </div>
        <div>
          <dt className="text-sm">Profile picture</dt>
          <dd>
            {pictureSrc ? (
              <Image
                src={pictureSrc}
                alt="Profile picture"
                width={96}
                height={96}
                unoptimized
                className="h-24 w-24 object-cover"
              />
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-sm">Bio</dt>
          <dd className="whitespace-pre-wrap">{profile.bio}</dd>
        </div>
        <div>
          <dt className="text-sm">Timezone</dt>
          <dd>{profile.timezone}</dd>
        </div>
      </dl>
      {isOwner ? (
        <>
          <ProfileForm
            name={profile.name}
            bio={profile.bio}
            timezone={profile.timezone}
          />
          <OwnEvents />
        </>
      ) : null}
    </main>
  );
}
