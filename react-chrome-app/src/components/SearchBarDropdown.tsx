import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FILTERS, TSearchQueryComponent } from "../utils/search";
import InputMenu from "./InputMenu";

const SearchBarDropdown = ({
  input,
  queryComponentWaitingForInput,
  addEmptyQueryComponent,
  updateLastQueryComponent,
  query,
  replaceQuery,
  fireSearch,
}: {
  input: string;
  queryComponentWaitingForInput: TSearchQueryComponent | null;
  addEmptyQueryComponent: (keyword: string, expectedInput: string) => void;
  updateLastQueryComponent: (value: string) => void;
  query: TSearchQueryComponent[];
  replaceQuery: (newQuery: TSearchQueryComponent[]) => void;
  fireSearch: () => void;
}) => {
  const [localHistory, setLocalHistory] = useState<
    { query: TSearchQueryComponent[]; date: number }[]
  >([]);

  useEffect(() => {
    (async () => {
      // @ts-ignore
      const { history } = await chrome.storage.local.get("history");
      if (history) {
        setLocalHistory(history);
      }
    })();
  }, []);

  const clearHistory = async () => {
    setLocalHistory([]);
    // @ts-ignore
    await chrome.storage.local.set({ history: [] });
  };

  const menu = useMemo(() => {
    //const content = new Map<string, {[key: string]: string}>();
    let content: { keyword: string; expectedInput: string }[] = [];
    for (let [filterKeyword, filterProperties] of FILTERS) {
      if (
        (input.trim() === "" ||
          filterKeyword.includes(
            input.toLowerCase().trim().replace(":", "")
          )) &&
        !(
          query.some((comp) => comp.keyword === filterKeyword) &&
          !filterProperties.allowMultipleUse
        )
      ) {
        content.push({
          keyword: filterKeyword,
          expectedInput: filterProperties.expectedInput,
        });
      }
    }
    return content;
  }, [input, query]);

  const onMenuItemClick = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      keyword: string,
      expectedInput: string
    ) => {
      addEmptyQueryComponent(keyword, expectedInput);
      event.stopPropagation();
    },
    [input]
  );

  return (
    <ul className="absolute w-80 xl:w-96 bg-black rounded-xl shadow shadow-white py-3">
      {queryComponentWaitingForInput && (
        <InputMenu
          queryComponentWaitingForInput={queryComponentWaitingForInput}
          input={input}
          updateLastQueryComponent={updateLastQueryComponent}
        />
      )}
      {input.length > 0 && !queryComponentWaitingForInput && (
        <div
          className="px-3.5 py-4 flex space-x-2 cursor-pointer hover:bg-twitter-grey-200 items-center"
          onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            fireSearch();
            event.stopPropagation();
          }}
        >
          <div className="text-twitter-grey-100 uppercase">Search:</div>
          <div className="font-bold text-white grow">{input}</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-6 h-6 text-white"
          >
            <rect
              data-name="layer2"
              x="2"
              y="2"
              width="60"
              height="60"
              rx="7.8"
              ry="7.8"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></rect>
            <path
              data-name="layer1"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M16 32h30v-8"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
            <path
              data-name="layer1"
              fill="none"
              stroke="currentColor"
              stroke-miterlimit="10"
              stroke-width="2"
              d="M24 40l-8-8 8-8"
              stroke-linejoin="round"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
      )}
      {menu.length > 0 && !queryComponentWaitingForInput && (
        <>
          <div className="px-3.5 font-bold text-twitter-grey-100 mb-1">
            Search options
          </div>
          <div className="flex flex-col">
            {menu.map(({ keyword, expectedInput }) => (
              <div
                className="group px-3.5 py-1 flex hover:bg-twitter-grey-200 cursor-pointer"
                key={`keyword-${keyword}`}
                onClick={(event) =>
                  onMenuItemClick(event, keyword, expectedInput)
                }
              >
                <div className="font-semibold mr-2 text-white">{`${keyword}:`}</div>
                <div className="text-twitter-grey-100 grow">
                  {expectedInput}
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 text-white invisible group-hover:visible"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </div>
            ))}
          </div>
        </>
      )}
      {localHistory.length > 0 && !queryComponentWaitingForInput && (
        <div className="space-y-1">
          <div className="px-3.5 flex justify-between items-center">
            <div className="font-bold text-twitter-grey-100 capitalize">
              History
            </div>
            <div
              className="rounded-full p-2 hover:bg-twitter-grey-200 cursor-pointer"
              onClick={(
                event: React.MouseEvent<HTMLDivElement, MouseEvent>
              ) => {
                clearHistory();
                event.stopPropagation();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-twitter-grey-100"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </div>
          </div>
          <div className="overflow-y-auto max-h-48 scrollbar-hide">
            {localHistory
              .sort((a, b) => b?.date - a?.date)
              .map((historyComp, index) => (
                <div
                  className="group px-3.5 py-1 flex hover:bg-twitter-grey-200 cursor-pointer"
                  key={`history-query-${index}`}
                  onClick={(
                    event: React.MouseEvent<HTMLDivElement, MouseEvent>
                  ) => {
                    replaceQuery(historyComp.query);
                    event.stopPropagation();
                  }}
                >
                  <div className="text-twitter-grey-100 grow truncate">
                    {historyComp.query.reduce(
                      (acc, curr) => acc + `${curr.keyword}: ${curr.value} `,
                      ""
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-white invisible group-hover:visible"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              ))}
          </div>
        </div>
      )}
    </ul>
  );
};

export default SearchBarDropdown;
