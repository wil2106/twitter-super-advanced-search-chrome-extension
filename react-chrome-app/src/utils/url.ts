import { EExpectedSearchInput, ESearchKeyword, TSearchQueryComponent } from "./search";

const twitterUrl = "https://twitter.com";

export const parseUrl = (): TSearchQueryComponent[] => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let searchQueryComponents: TSearchQueryComponent[] = [];
    for (const p of urlParams) {
      if (p[0] === 'q'){
        let q = p[1];
        if (q.length === 0) break;

        const clearMatch = (match: RegExpExecArray) => {
          q = q.substring(0, match.index) + q.substring(match.index + match[0].length);
        }
        
        // 'have_exactly'
        const exactlyMatch = /".*"/g.exec(q);
        if (exactlyMatch && exactlyMatch.length > 0 && exactlyMatch[0]){
          const formattedStr = exactlyMatch[0].replaceAll('"', "");
          const splitted = formattedStr.split(" ");
          const words = splitted.filter(Boolean).reduce((acc, curr) => acc + " " + curr, "");

          searchQueryComponents.push({
            keyword: ESearchKeyword.HAVE_EXACTLY,
            value: words,
            expectedInput: EExpectedSearchInput.WORDS,
          });
          
          clearMatch(exactlyMatch);
        }
        
        
        // 'have_either'
        const eitherMatch = /\((?!(from:|@|to:|#))[^)]+\)/g.exec(q);
        if (eitherMatch && eitherMatch.length > 0 && eitherMatch[0]){
          const formattedStr = eitherMatch[0].replaceAll(/\(|OR|\)/g, "");
          const splitted = formattedStr.split(" ");
          const words = splitted.filter(Boolean).reduce((acc, curr) => acc + " " + curr, "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.HAVE_EITHER,
            value: words,
            expectedInput: EExpectedSearchInput.WORDS,
          });
          clearMatch(eitherMatch);
        }
        
        // 'have_none'
        let noneMatches = [];
        let noneMatch = null;
        do {
          noneMatch = /(^| )-(?!(filter:))[^\s]+/g.exec(q);
          if (noneMatch && noneMatch.length > 0 && noneMatch[0]){
            const formattedStr = noneMatch[0].replaceAll(/ |-/g, "");
            noneMatches.push(formattedStr);
            clearMatch(noneMatch);
          }
        } while(noneMatch !== null);
        const noneWords = noneMatches.filter(Boolean).reduce((acc, curr) => acc + " " + curr, "");
        if (noneWords.trim() !== ""){
          searchQueryComponents.push({
            keyword: ESearchKeyword.HAVE_NONE,
            value: noneWords,
            expectedInput: EExpectedSearchInput.WORDS,
          });
        }
        
        // '#'
        const hashMatch = /\(#[^)]+\)/g.exec(q);
        if (hashMatch && hashMatch.length > 0 && hashMatch[0]){
          const formattedStr = hashMatch[0].replaceAll(/\(|OR|\)|#/g, "");
          const splitted = formattedStr.split(" ");
          const words = splitted.filter(Boolean).reduce((acc, curr) => acc + " " + curr, "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.HASHTAGS,
            value: words,
            expectedInput: EExpectedSearchInput.HASHTAGS,
          });
          clearMatch(hashMatch);
        }
        
        // 'lang'
        const langMatch = /lang:[^\s)]+/g.exec(q);
        if (langMatch && langMatch.length > 0 && langMatch[0]){
          const formattedStr = langMatch[0].replaceAll("lang:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.LANG,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.LANGUAGE,
          });
          clearMatch(langMatch);
        }
        
        // 'from'
        const fromMatches = /\(from:[^)]+\)/g.exec(q);
        if (fromMatches && fromMatches.length > 0 && fromMatches[0]){
          const formattedStr = fromMatches[0].replaceAll(/\(|OR|\)|from:/g, "");
          const splitted = formattedStr.split(" ");
          splitted.filter(Boolean).forEach((usr) => {
            searchQueryComponents.push({
              keyword: ESearchKeyword.FROM,
              value: usr,
              expectedInput: EExpectedSearchInput.USER,
            });
          });
          clearMatch(fromMatches);
        }
        
        // 'reply_to'
        const toMatches = /\(to:[^)]+\)/g.exec(q);
        if (toMatches && toMatches.length > 0 && toMatches[0]){
          const formattedStr = toMatches[0].replaceAll(/\(|OR|\)|to:/g, "");
          const splitted = formattedStr.split(" ");
          splitted.filter(Boolean).forEach((usr) => {
            searchQueryComponents.push({
              keyword: ESearchKeyword.REPLY_TO,
              value: usr,
              expectedInput: EExpectedSearchInput.USER,
            });
          });
          clearMatch(toMatches);
        }
        
        // 'mentions'
        const mentionsMatches = /\(@[^)]+\)/g.exec(q);
        if (mentionsMatches && mentionsMatches.length > 0 && mentionsMatches[0]){
          const formattedStr = mentionsMatches[0].replaceAll(/\(|OR|\)|@/g, "");
          const splitted = formattedStr.split(" ");
          splitted.filter(Boolean).forEach((usr) => {
            searchQueryComponents.push({
              keyword: ESearchKeyword.MENTIONS,
              value: usr,
              expectedInput: EExpectedSearchInput.USER,
            });
          });
          clearMatch(mentionsMatches);
        }
        
        // only 'replies'
        const onlyRepliesMatch = /(^|[^-])filter:replies/g.exec(q);
        if (onlyRepliesMatch && onlyRepliesMatch.length > 0 && onlyRepliesMatch[0]){
          searchQueryComponents.push({
            keyword: ESearchKeyword.REPLIES,
            value: "only",
            expectedInput: EExpectedSearchInput.REPLIES_OPTIONS,
          });
          clearMatch(onlyRepliesMatch);
        }
        
        // no 'replies'
        const noRepliesMatch = /-filter:replies/g.exec(q);
        if (noRepliesMatch && noRepliesMatch.length > 0 && noRepliesMatch[0]){
          searchQueryComponents.push({
            keyword: ESearchKeyword.REPLIES,
            value: "none",
            expectedInput: EExpectedSearchInput.REPLIES_OPTIONS,
          });
          clearMatch(noRepliesMatch);
        }
        
        // only 'links'
        const onlyLinksMatch = /(^|[^-])filter:links/g.exec(q);
        if (onlyLinksMatch && onlyLinksMatch.length > 0 && onlyLinksMatch[0]){
          searchQueryComponents.push({
            keyword: ESearchKeyword.LINKS,
            value: "only",
            expectedInput: EExpectedSearchInput.LINKS_OPTIONS,
          });
          clearMatch(onlyLinksMatch);
        }
        
        // no 'links'
        const noLinksMatch = /-filter:links/g.exec(q);
        if (noLinksMatch && noLinksMatch.length > 0 && noLinksMatch[0]){
          searchQueryComponents.push({
            keyword: ESearchKeyword.LINKS,
            value: "none",
            expectedInput: EExpectedSearchInput.LINKS_OPTIONS,
          });
          clearMatch(noLinksMatch);
        }
        
        // 'min_replies'
        const minRepliesMatches = /min_replies:\d+/g.exec(q);
        if (minRepliesMatches && minRepliesMatches.length > 0 && minRepliesMatches[0]){
          const formattedStr = minRepliesMatches[0].replaceAll("min_replies:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.MIN_REPLIES,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.NUMBER,
          });
          clearMatch(minRepliesMatches);
        }
        
        // 'min_likes'
        const minLikesMatches = /min_faves:\d+/g.exec(q);
        if (minLikesMatches && minLikesMatches.length > 0 && minLikesMatches[0]){
          const formattedStr = minLikesMatches[0].replaceAll("min_faves:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.MIN_LIKES,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.NUMBER,
          });
          clearMatch(minLikesMatches);
        }
        
        // 'min_rt'
        const minRtMatches = /min_retweets:\d+/g.exec(q);
        if (minRtMatches && minRtMatches.length > 0 && minRtMatches[0]){
          const formattedStr = minRtMatches[0].replaceAll("min_retweets:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.MIN_RT,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.NUMBER,
          });
          clearMatch(minRtMatches);
        }
        
        // 'since'
        const sinceMatches = /since:[^\s]+/g.exec(q);
        if (sinceMatches && sinceMatches.length > 0 && sinceMatches[0]){
          const formattedStr = sinceMatches[0].replaceAll("since:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.SINCE,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.DATE,
          });
          clearMatch(sinceMatches);
        }
        
        // 'until'
        const untilMatches = /until:[^\s]+/g.exec(q);
        if (untilMatches && untilMatches.length > 0 && untilMatches[0]){
          const formattedStr = untilMatches[0].replaceAll("until:", "");
          searchQueryComponents.push({
            keyword: ESearchKeyword.UNTIL,
            value: formattedStr,
            expectedInput: EExpectedSearchInput.DATE,
          });
          clearMatch(untilMatches);
        }
        
        
        const haveEveryWords = q.split(" ").filter(Boolean).reduce((acc, curr) => acc + " " + curr, "");
        if(haveEveryWords.trim() !== ""){
          searchQueryComponents.push({
            keyword: ESearchKeyword.HAVE_EVERY,
            value: haveEveryWords,
            expectedInput: EExpectedSearchInput.WORDS,
          });
        }
        
      } else if (p[0] === 'lf' && p[1] === 'on'){
        searchQueryComponents.push({
          keyword: ESearchKeyword.LOCATION,
          value: "near",
          expectedInput: EExpectedSearchInput.LOCATION_OPTIONS,
        });
      } else if (p[0] === 'pf' && p[1] === 'on'){
        searchQueryComponents.push({
          keyword: ESearchKeyword.PEOPLE,
          value: "followed",
          expectedInput: EExpectedSearchInput.PEOPLE_OPTIONS,
        });
      }
    }
    return searchQueryComponents;
}

export const buildUrl = (searchQueryComponents: TSearchQueryComponent[], additionalStringInput?: string): string => {
  let queryString = "";
  let suffixString = "";
  
  if (additionalStringInput){
    queryString += additionalStringInput;
  }

  for (let i=0; i < searchQueryComponents.length; i++){
    const searchQueryComponent = searchQueryComponents[i];
    switch (searchQueryComponent.keyword){
      case ESearchKeyword.HAVE_EVERY:
        queryString += ` ${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.HAVE_EXACTLY:
        queryString += ` "${searchQueryComponent.value}"`;
        break;
      case ESearchKeyword.HAVE_EITHER:
        queryString += ` (${searchQueryComponent.value.split(" ").filter(Boolean).join(" OR ")})`;
        break;
      case ESearchKeyword.HAVE_NONE:
        queryString += ` ${searchQueryComponent.value.split(" ").filter(Boolean).map((val) => `-${val}`).join(" ")}`
        break;
      case ESearchKeyword.HASHTAGS:
        queryString += ` (${searchQueryComponent.value.split(" ").filter(Boolean).map((val) => `#${val}`).join(" OR ")})`;
        break;
      case ESearchKeyword.LANG:
        queryString += ` lang:${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.REPLIES:
        if (searchQueryComponent.value === "only"){
          queryString += " filter:replies";
        } else if (searchQueryComponent.value === "none"){
          queryString += " -filter:replies";
        }
        break;
      case ESearchKeyword.LINKS:
        if (searchQueryComponent.value === "only"){
          queryString += " filter:links";
        } else if (searchQueryComponent.value === "none"){
          queryString += " -filter:links";
        }
        break;
      case ESearchKeyword.PEOPLE:
        if (searchQueryComponent.value === "followed"){
          suffixString += "&pf=on";
        }
        break;
      case ESearchKeyword.LOCATION:
        if (searchQueryComponent.value === "near"){
          suffixString += "&lf=on";
        }
        break;
      case ESearchKeyword.MIN_REPLIES:
        queryString += ` min_replies:${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.MIN_LIKES:
        queryString += ` min_faves:${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.MIN_RT:
        queryString += ` min_retweets:${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.SINCE:
        queryString += ` since:${searchQueryComponent.value}`;
        break;
      case ESearchKeyword.UNTIL:
        queryString += ` until:${searchQueryComponent.value}`;
        break;
    }
  }

  //from
  const fromComponents = searchQueryComponents.filter((comp) => comp.keyword === ESearchKeyword.FROM);
  if(fromComponents.length > 0){
    queryString += ` (${fromComponents.map((comp) => `from:${comp.value}`).join(" OR ")})`;
  }
  //to
  const replyToComponents = searchQueryComponents.filter((comp) => comp.keyword === ESearchKeyword.REPLY_TO);
  if(replyToComponents.length > 0){
    queryString += ` (${replyToComponents.map((comp) => `to:${comp.value}`).join(" OR ")})`;
  }
  //@
  const mentionsComponents = searchQueryComponents.filter((comp) => comp.keyword === ESearchKeyword.MENTIONS);
  if(mentionsComponents.length > 0){
    queryString += ` (${mentionsComponents.map((comp) => `@${comp.value}`).join(" OR ")})`;
  }

  return `${twitterUrl}/search?q=${encodeURIComponent(queryString)}&src=typed_query${suffixString}`;
}