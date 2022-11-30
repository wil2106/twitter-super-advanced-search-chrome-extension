import React, { useEffect, useRef, useState } from "react";
import { fetchUsers, User } from "../utils/requests";
import UserListItem from "./UserListItem";

const UserInputMenu = ({ input, updateLastQueryComponent }: { input: string, updateLastQueryComponent: (value: string) => void; }) => {

  const [loading, setLoading] = useState(false);
  
  const [state, setState] = useState<{search: string, results: { cursor: string | null; users: User[] }}>({search: "", results: {cursor: null, users: []}});

  const timerRef = useRef<any>();

  const firstUpdate = useRef<boolean>(true);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setState({
        search: input,
        results: { cursor: null, users: [] }
      });
    }, 500);
  }, [input]);

  useEffect(() => {
    searchUsers();
  }, [state.search]);

  const searchUsers = async () => {
    if (state.results.cursor === "") return;

    setLoading(true);
    const fetchResult = await fetchUsers(state.search, state.results.cursor);

    if (state.results.cursor === null) {
      setState({
        search: input,
        results: {cursor: fetchResult.newCursor, users: fetchResult.users }
      });
    } else {
      setState((prevState) => ({
        search: input,
        results: {
          cursor: fetchResult.newCursor,
          users: [...prevState.results.users, ...fetchResult.users],
        }
      }));
    }
    setLoading(false);
  };

  const onScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && state.search === "") {
      searchUsers();
    }
  };

  return (
    <div>
      {
        state.search === "" && state.results.users.length > 0 && (
          <div className="px-3.5 font-bold text-twitter-grey-100 mb-1">
            Following
          </div>
        )
      }
      <div className="flex flex-col">
        {/*input.trim().length > 0 &&
          results.users.length === 0 &&
          results.cursor === null && (
            <div className="self-center flex flex-col mt-5 mx-6">
              <div className="text-white font-semibold">{`No results for "${input}"`}</div>
              <div className="text-twitter-grey-100">
                The term you entered did not bring up any results
              </div>
            </div>
          )
        */}
        {state.results.users.length > 0 && (
          <div
            className="flex flex-col overflow-y-auto h-96 scrollbar-hide"
            onScroll={onScroll}
          >
            {state.results.users.map((user) => (
              <UserListItem user={user} onClick={(screenName) => updateLastQueryComponent(screenName)}/>
            ))}
          </div>
        )}
        {loading && (
          <svg
            role="status"
            className="inline h-8 w-8 animate-spin text-twitter-blue-100 text-opacity-30 fill-twitter-blue-100 mt-5 self-center"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </div>
    </div>
  );
};

export default UserInputMenu;