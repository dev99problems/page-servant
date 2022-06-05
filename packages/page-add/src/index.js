import { main as page_servant_main, get_notion } from '@dev99problems/page-servant_notion';

const notion = get_notion(NOTION_TOKEN);

addEventListener('scheduled', event => {
  return event.waitUntil(triggerEvent(event.scheduledTime));
});

async function triggerEvent() {
  await page_servant_main(notion, JOURNAL_ID, TOPIC);
}
