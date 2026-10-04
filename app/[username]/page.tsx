import { notFound } from "next/navigation";
import { OwnEvents } from "@/app/[username]/own-events";
import { ProfileForm } from "@/app/[username]/profile-form";
import { ProfileAvatar } from "@/app/components/profile-avatar";
import { getCurrentUser } from "@/lib/current-user";
import { timezoneGroups } from "@/lib/timezones";
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
  const heading = profile.name || profile.username;

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-5 py-12">
      <article className="rounded-[28px] border border-line bg-card p-6 shadow-[var(--shadow)] sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          <ProfileAvatar
            src={pictureSrc}
            name={profile.name}
            username={profile.username}
            size="xl"
          />
          <div className="min-w-0">
            <h1 className="font-display text-4xl tracking-tight text-ink">
              {heading}
            </h1>
            <p className="mt-1 text-lg text-muted">@{profile.username}</p>
          </div>
        </div>
        {profile.bio ? (
          <p className="mt-8 text-base leading-7 whitespace-pre-wrap text-ink">
            {profile.bio}
          </p>
        ) : null}
        {profile.timezone ? (
          <p className="mt-6 text-sm text-muted">
            <span className="font-medium text-ink">Timezone</span>
            {" · "}
            {profile.timezone.replaceAll("_", " ")}
          </p>
        ) : null}
      </article>
      {isOwner ? (
        <>
          <ProfileForm
            username={profile.username}
            name={profile.name}
            bio={profile.bio}
            timezone={profile.timezone}
            pictureSrc={pictureSrc}
            groups={timezoneGroups()}
          />
          <OwnEvents />
        </>
      ) : null}
    </main>
  );
}
