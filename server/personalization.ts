// SERVER ONLY. Never import this file from src/. Fill placeholders before launch.
export const personalization = {
  nickname:'[Recipient nickname]', signature:'[Sender signature]',
  elevenMessages:Array.from({length:11},(_,i)=>`[Personal message ${i+1} — add a real detail]`),
  insideJokes:['[Inside joke — replace with your own words]'],
  memories:[{title:'[Memory title]',caption:'[Describe a real shared memory]',image:null as string|null}],
  song:{title:'[Song title]',file:null as string|null,license:'[License/permission reference required]'},
  letter:['[Write your personal final letter here.]'],
  hiddenMessages:['[A hidden message for her]'],
} as const
