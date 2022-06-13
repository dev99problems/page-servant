const default_sort_by = {
  timestamp: 'created_time',
  direction: 'ascending',
};

class NotionUtils {
  constructor(notion) {
    this.notion = notion;
  }

  get_page_name (page) {
    const page_name_prop = page?.properties?.Name;
    const page_name = page_name_prop?.title?.[0]?.text?.content ?? '';

    return page_name;
  }

  async fetch_db_pages (db_id, sort_by = default_sort_by) {
    try {
      const res = await this.notion.databases.query({
        database_id: db_id,
        sorts: [
          sort_by,
        ],
      });

      const pages = res?.results ?? [];

      return pages;
    } catch (err) {
      console.error(`Error while fetching pages: ${err}`);
      return [];
    }
  }

  async fetch_topic_pages (db_id, topic) {
    const pages = await this.fetch_db_pages(db_id);

    const topic_pages = pages.filter((page) => {
      const page_name = this.get_page_name(page);

      return page_name.includes(topic);
    });

    return topic_pages;
  }

  async fetch_topic_last_page(db_id, topic) {
    const pages = await this.fetch_topic_pages(db_id, topic) ?? [];
    const last_page = pages[pages.length - 1];

    return last_page;
  }
}

export { NotionUtils };
