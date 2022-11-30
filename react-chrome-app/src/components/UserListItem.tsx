import { VerifiedIcon } from "../utils/icons";
import { User } from "../utils/requests";

const UserListItem = ({
  user,
  onClick,
}: {
  user: User;
  onClick: (screenName: string) => void;
}) => {
  return (
    <div
      className="px-6 py-3 flex flex-row hover:bg-twitter-grey-200 cursor-pointer items-center"
      onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        onClick(user.screenName)
      }}
    >
      <img
        className="w-10 h-10 rounded-full"
        src={user.thumbnailUrl}
        alt="Avatar"
      />
      <div className="ml-4 flex flex-col">
        <div className="flex flex-row items-center">
          <div className="text-white font-semibold">{user.name}</div>
          {user.verified && (
            <div className="ml-0.5">
              <VerifiedIcon />
            </div>
          )}
        </div>
        <div className="text-twitter-grey-100">{`@${user.screenName}`}</div>
      </div>
    </div>
  );
};

export default UserListItem;
