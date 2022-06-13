import { page_creation_flow as createNewPage } from '@dev99problems/page-servant_notion';

addEventListener('scheduled', (event) => {
  event.waitUntil(triggerEvent(event.scheduledTime));
});

async function triggerEvent(timestamp) {
  console.log('timestamp of last trigger', timestamp);
  await createNewPage(NOTION_TOKEN, JOURNAL_ID, TOPIC);
}


// NOTE: this is for local testing
/*addEventListener('fetch', (event) => {
  return event.respondWith(handleFetch(event.request));
});

async function handleFetch (req) {
  const url = new URL(req?.url);
  const {pathname} = url;

  if (pathname !== '/favicon.ico') {
    await triggerEvent();
  }

  return new Response('Hello worker!', {status: 200});
};*/
