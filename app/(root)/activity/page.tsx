import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { Date } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const options = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  console.log(activity);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col-reverse gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <div className="flex flex-1">
                    <div className="mr-1">
                      <Image
                        src={activity.author.image}
                        alt="Profile picture"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        @{activity.author.username}
                      </span>
                      replied to your thread
                    </p>{" "}
                  </div>
                  <p className="hidden md:flex flex-1 justify-end !text-small-regular text-light-4">
                    {formatDate(activity.createdAt)}
                  </p>
                  <div className="hidden md:flex flex-1 justify-end !text-small-regular text-light-4">
                    {activity.text.length > 10
                      ? activity.text.slice(0, 7) + "..."
                      : activity.text}
                  </div>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </section>
  );
};

export default page;
