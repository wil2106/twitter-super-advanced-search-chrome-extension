import React, { useEffect, useMemo, useRef, useState } from "react";
import { EExpectedSearchInput, FILTERS, TSearchQueryComponent } from "../utils/search";
import { buildUrl, parseUrl } from "../utils/url";
import SearchBarDropdown from "./SearchBarDropdown";

const SearchBar = () => {
  const [query, setQuery] = useState<TSearchQueryComponent[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => console.log(query), [query]);

  const queryComponentWaitingForInput = useMemo(() => {
    const lastQueryComponent = query.slice(-1)[0];
    if (query.length > 0 && lastQueryComponent.value === "") {
      return lastQueryComponent;
    } else {
      return null;
    }
  }, [query]);

  useEffect(() => {

    const searchQueryComponents = parseUrl();
    setQuery(searchQueryComponents);

    //dropdown click
    const handleClick = (e: any) => {
      if (componentRef && componentRef.current) {
        const ref: any = componentRef.current;
        if (!ref.contains(e.target)) {
          setIsFocused(false);
        }
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const componentRef = useRef<any>();
  const inputRef = useRef<any>();

  const fireSearch = async () => {
    try {
      const url = buildUrl(query, searchInput);
      // @ts-ignore
      const {history} = await chrome.storage.local.get("history");
      let historyQueries = [];
      if (history){
        historyQueries = [...history, {query, date: new Date().getTime()}];
      } else {
        historyQueries = [{query, date: new Date().getTime()}];
      }
      // @ts-ignore
      await chrome.storage.local.set({history: historyQueries});
      window.location.replace(url);
    } catch(err) {
      console.log(err);
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setIsFocused(true);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    if (event.target.value.slice(-1) !== ":") {
      return;
    }
    const cleanedInput = event.target.value
      .toLowerCase()
      .replace(":", "")
      .trim();
    const filter = FILTERS.get(cleanedInput);
    if (filter) {
      addEmptyQueryComponent(cleanedInput, filter.expectedInput);
    }
  };

  const replaceQuery = (newQuery: TSearchQueryComponent[]) => {
    setQuery(newQuery);
    focusInput();
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Backspace" && searchInput === "" && query.length > 0) {
      console.log("BACKSPACE");
      setQuery((prevState) => prevState.slice(0, -1));
    } else if (event.key === "Enter") {
      const lastQueryComponent = query.slice(-1)[0];
      if (lastQueryComponent?.value === "" && searchInput.trim().length > 0) {
        updateLastQueryComponent(searchInput);
      } else if (query.length > 0 || searchInput.trim().length > 0) {
        fireSearch();
      }
    }
  };

  const onClearInput = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    console.log("CLEAR INPUT");
    setSearchInput("");
    setQuery([]);
    event.stopPropagation();
    focusInput();
  };

  const addEmptyQueryComponent = (keyword: string, expectedInput: string) => {
    console.log("ADD EMPTY QUERY COMPONENT", keyword, expectedInput);
    setSearchInput("");
    setQuery((prevState) => [
      ...prevState,
      {
        keyword,
        value: "",
        expectedInput,
      },
    ]);
    focusInput();
  };

  const updateLastQueryComponent = (value: string) => {
    value = value.trim();
    console.log("UPDATE LAST QUERY COMPONENT", value);
    setSearchInput("");
    setQuery((prevState) => {
      const lastQueryComponent = prevState.slice(-1)[0];
      const queryComponents = prevState.slice(0, -1);
      if (lastQueryComponent) {
        return [...queryComponents, { ...lastQueryComponent, value }];
      } else {
        return prevState;
      }
    });
    focusInput();
  };

  return (
    <div
      ref={componentRef}
      className={`relative w-full rounded-full bg-twitter-grey-200 ${
        isFocused ? "border border-twitter-blue-100 bg-black" : ""
      }`}
      onClick={() => {
        focusInput();
      }}
    >
      <div className="w-full pr-3.5 flex items-center">
        <div className="grow overflow-x-auto scrollbar-hide items-center flex flex-row-reverse rounded-l-full pl-4">
          <input
            ref={inputRef}
            onKeyDown={onKeyDown}
            type="search"
            id="default-search"
            className="bg-transparent placeholder-twitter-grey-100 text-white outline-0 py-3 w-28 grow"
            placeholder={
              queryComponentWaitingForInput
                ? queryComponentWaitingForInput.expectedInput
                : query.length === 0
                ? "Search Twitter"
                : ""
            }
            onChange={onInputChange}
            value={searchInput}
            autoComplete="off"
          />
          {query
            .slice(0)
            .reverse()
            .map((component) => (
              <div className="p-2 py-1 mr-1 bg-twitter-blue-100 bg-opacity-30 rounded flex">
                <div className="text-twitter-blue-100">{`${component.keyword}:`}</div>
                {component.value.length > 0 && (
                  <div className="text-white ml-1 whitespace-nowrap">
                    {component.value}
                  </div>
                )}
              </div>
            ))}
        </div>
        {searchInput.length > 0 || query.length > 0 ? (
          <div
            className="rounded-full p-1 hover:bg-twitter-blue-100 hover:bg-opacity-30 flex items-center justify-center"
            onClick={onClearInput}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-twitter-blue-100 cursor-pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <svg
            className={`w-6 h-6 ${
              isFocused
                ? "text-twitter-blue-100"
                : "text-twitter-grey-100"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        )}
      </div>
      {isFocused &&
        queryComponentWaitingForInput?.expectedInput !==
          EExpectedSearchInput.WORDS &&
        queryComponentWaitingForInput?.expectedInput !==
          EExpectedSearchInput.HASHTAGS &&
        queryComponentWaitingForInput?.expectedInput !==
          EExpectedSearchInput.NUMBER && (
          <SearchBarDropdown
            input={searchInput}
            queryComponentWaitingForInput={queryComponentWaitingForInput}
            addEmptyQueryComponent={addEmptyQueryComponent}
            updateLastQueryComponent={updateLastQueryComponent}
            query={query}
            replaceQuery={replaceQuery}
            fireSearch={fireSearch}
          />
        )}
    </div>
  );
};

export default SearchBar;