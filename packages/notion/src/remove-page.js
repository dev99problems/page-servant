import { NotionUtils } from './notion-utils.js';

class RemovePage extends NotionUtils {
  remove_page(page_id, archive_status = true) {
    return this.notion.pages.update({
      page_id,
      archived: archive_status
    });
  }

  async remove_topic_last_page(db_id, topic) {
    const last_page = await this.fetch_topic_last_page(db_id, topic);
    const page_name = this.get_page_name(last_page) ?? '';

    if (page_name.length && page_name?.trim().endsWith('-')) {
      const { id } = last_page ?? {};
      await this.remove_page(id)
    } else {
      throw new Error('Last page does not have a valid name format');
    }
  }
}

export { RemovePage };
