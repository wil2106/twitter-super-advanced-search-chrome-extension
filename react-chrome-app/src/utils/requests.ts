import { getCookies } from "./cookies";

export type User = {
  thumbnailUrl: string;
  name: string;
  screenName: string;
  description: string;
  verified: boolean;
}

const FOLLOWING_RESULTS_COUNT = 20;

export const fetchUsers = async (query: string, cursor: string | null): Promise<{users: User[], newCursor: string | null}> => {

  const cookies = getCookies();
  try {
    if (query !== ""){

      const res = await fetch(`https://twitter.com/i/api/1.1/search/typeahead.json?include_ext_is_blue_verified=1&q=${query}&src=compose&result_type=users&context_text=%40${query}`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "authorization": cookies['search_extension_auth_token'],
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": cookies['ct0'],
          "x-twitter-active-user": "yes",
          "x-twitter-auth-type": "OAuth2Session",
          "x-twitter-client-language": "en"
        },
        "referrer": "https://twitter.com/compose/tweet",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

      const data = await res.json();
      let users: User[] = [];
      users = data?.users.map((user: any) => ({
        thumbnailUrl: user?.profile_image_url_https || "",
        name: user?.name || "",
        screenName: user?.screen_name || "",
        description: "",
        verified: user?.verified || false
      }));

      return {users, newCursor: null}

    } else {
      const cursorParam = cursor ? `%2C%22cursor%22%3A%22${encodeURIComponent(cursor)}%22` : '';

      const res = await fetch(
        `https://twitter.com/i/api/graphql/9rGM7YNDYuiqd0Cb0ZwLJw/Following?variables=%7B%22userId%22%3A%22${cookies['twid'].replace("u=", "")}%22%2C%22count%22%3A${FOLLOWING_RESULTS_COUNT}${cursorParam}%2C%22includePromotedContent%22%3Afalse%2C%22withSuperFollowsUserFields%22%3Atrue%2C%22withDownvotePerspective%22%3Afalse%2C%22withReactionsMetadata%22%3Afalse%2C%22withReactionsPerspective%22%3Afalse%2C%22withSuperFollowsTweetFields%22%3Atrue%7D&features=%7B%22responsive_web_twitter_blue_verified_badge_is_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22unified_cards_ad_metadata_container_dynamic_card_content_query_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_uc_gql_enabled%22%3Atrue%2C%22vibe_api_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Afalse%2C%22interactive_text_enabled%22%3Atrue%2C%22responsive_web_text_conversations_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Atrue%7D`, {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "authorization": cookies['search_extension_auth_token'],
          "content-type": "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": cookies['ct0'],
          "x-twitter-active-user": "yes",
          "x-twitter-auth-type": "OAuth2Session",
          "x-twitter-client-language": "en"
        },
        "referrer": "https://twitter.com/wil2106/following",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });  
  
      const {data} = await res.json();
      const instruction = data?.user?.result?.timeline?.timeline?.instructions?.find((instruction: any) => instruction.type === "TimelineAddEntries");
  
      let newCursor = "";
      let users: User[] = [];
      if (instruction?.entries){
        users = instruction.entries.filter((entry: any) => entry?.entryId?.includes("user")).map((entry: any) => ({
          thumbnailUrl: entry?.content?.itemContent?.user_results?.result?.legacy?.profile_image_url_https || "",
          name: entry?.content?.itemContent?.user_results?.result?.legacy?.name || "",
          screenName: entry?.content?.itemContent?.user_results?.result?.legacy?.screen_name || "",
          description: entry?.content?.itemContent?.user_results?.result?.legacy?.description || "",
          verified: entry?.content?.itemContent?.user_results?.result?.legacy?.verified || false
        }));
        let bottomCursorEntry = instruction.entries.find((entry: any) => entry?.content?.cursorType === "Bottom");
        if (bottomCursorEntry && users.length === FOLLOWING_RESULTS_COUNT){
          newCursor = bottomCursorEntry.content?.value;
        }
      }
    
      return {users, newCursor}
    }

  } catch (err){
    console.log(err);
    return {users: [], newCursor: ""}
  }
}