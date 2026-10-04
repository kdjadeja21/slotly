import { notFound } from "next/navigation";
import { ProfileAvatar } from "@/app/components/profile-avatar";
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
      <header className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
        <ProfileAvatar
          src={pictureSrc}
          name={profile.name}
          username={profile.username}
          size="xl"
        />
        <div className="flex flex-col gap-1">
          {profile.name ? (
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.name}
            </h1>
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.username}
            </h1>
          )}
          {profile.name ? (
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {profile.username}
            </p>
          ) : null}
        </div>
      </header>

      {(profile.bio || profile.timezone) && (
        <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-zinc-50/80 p-5 dark:border-white/15 dark:bg-white/[.03]">
          {profile.bio ? (
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Bio
              </h2>
              <p className="mt-1 whitespace-pre-wrap">{profile.bio}</p>
            </div>
          ) : null}
          {profile.timezone ? (
            <div>
              <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Timezone
              </h2>
              <p className="mt-1">{profile.timezone}</p>
            </div>
          ) : null}
        </div>
      )}

      {isOwner ? (
        <>
          <ProfileForm
            username={profile.username}
            name={profile.name}
            bio={profile.bio}
            timezone={profile.timezone}
            pictureSrc={pictureSrc}
          />
          <OwnEvents />
        </>
      ) : null}
    </main>
  );
}
