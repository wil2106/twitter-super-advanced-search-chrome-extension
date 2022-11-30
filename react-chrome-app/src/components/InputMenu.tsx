import React, { useEffect } from "react";
import { LANGUAGES } from "../utils/lang";
import { EExpectedSearchInput, TSearchQueryComponent } from "../utils/search";
import UserInputMenu from "./UserInputMenu";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { format } from "date-fns";

const InputMenu = ({
  queryComponentWaitingForInput,
  input,
  updateLastQueryComponent,
}: {
  queryComponentWaitingForInput: TSearchQueryComponent,
  input: string,
  updateLastQueryComponent: (value: string) => void;
}) => {

  const onSelectDate = (date: Date | undefined) => {
    if (!date) return;
    const dateString = format(date, "yyyy-MM-dd");
    updateLastQueryComponent(dateString);
  };

  switch (queryComponentWaitingForInput.expectedInput) {
    case EExpectedSearchInput.LANGUAGE:
      return (
        <div className="overflow-y-auto h-96 scrollbar-hide">
          {LANGUAGES
            .filter((lang) => {
              if (
                input.trim() === "" ||
                lang.code.includes(input.toLowerCase())
              ) {
                return true;
              } else {
                return false;
              }
            })
            .map((lang) => (
              <div
                className="group px-3.5 py-1 flex hover:bg-twitter-grey-200 cursor-pointer"
                key={`lang-${lang.code}`}
                onClick={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => {
                  updateLastQueryComponent(lang.code);
                  event.stopPropagation();
                }}
              >
                <div className="font-semibold mr-2 text-twitter-grey-100 grow">
                  {lang.name}
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
      );
    case EExpectedSearchInput.USER:
      return <UserInputMenu input={input} updateLastQueryComponent={updateLastQueryComponent}/>;
    case EExpectedSearchInput.REPLIES_OPTIONS:
    case EExpectedSearchInput.LINKS_OPTIONS:
    case EExpectedSearchInput.PEOPLE_OPTIONS:
    case EExpectedSearchInput.LOCATION_OPTIONS:
      return (
        <>
          {queryComponentWaitingForInput?.expectedInput
            .split(",")
            .map((opt) => (
              <div
                className="group px-3.5 py-1 flex hover:bg-twitter-grey-200 cursor-pointer"
                key={`option-${opt}`}
                onClick={(
                  event: React.MouseEvent<HTMLDivElement, MouseEvent>
                ) => {
                  updateLastQueryComponent(opt);
                  event.stopPropagation();
                }}
              >
                <div className="font-semibold mr-2 text-twitter-grey-100 grow">
                  {opt.trim()}
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
        </>
      );
    case EExpectedSearchInput.DATE:
      return (
        <>
          <DayPicker
            mode="single"
            onSelect={(day, _, __, event) => {
              onSelectDate(day);
              event.stopPropagation();
            }}
            styles={{
              caption: { color: "white" },
              head: { color: "white" },
              day: { color: "white" },
            }}
          />
        </>
      );
    default:
      return <></>
  }
}

export default InputMenu;