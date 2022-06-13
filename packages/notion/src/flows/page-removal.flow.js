import { RemovePage } from '../remove-page.js';
import { get_notion} from '../notion-client.js';

export const page_removal_flow = async (notion_token, journal_db_id, topic) => {
  try {
    const notion = get_notion(notion_token);
    const page_remover = new RemovePage(notion);

    await page_remover.remove_topic_last_page(journal_db_id, topic);
  } catch (err) {
    console.error(`ERROR: while Deleting the page — "${err.message}"`);
  }
};
