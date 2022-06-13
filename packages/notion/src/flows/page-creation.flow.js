import { CreatePage } from '../create-page.js';
import { tags } from '../tags.js';
import { get_notion} from '../notion-client.js';

export const page_creation_flow = async (notion_token, journal_db_id, topic) => {
  try {
    const notion = get_notion(notion_token);
    const page_creator = new CreatePage(notion);

    const page_name = await page_creator.prepare_new_page_name(journal_db_id, topic);
    await page_creator.create_new_page(journal_db_id, page_name, tags);
  } catch (err) {
    console.error(`ERROR: while Creating new page — "${err.message}"`);
  }
};
