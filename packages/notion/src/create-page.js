  import { NotionUtils } from './notion-utils.js';

class CreatePage extends NotionUtils {
  calc_new_page_name (last_page_name = '', topic) {
    // usually it's like: ruby 231 - 238
    const indices = last_page_name
      .replace(`${topic}`, '')
      .trim()
      .split('-');

    const [_, end] = indices;

    const new_start_index = +end + 1;
    const new_page_name = `${topic} ${new_start_index} - `;

    return new_page_name;
  }

  async prepare_new_page_name (db_id, topic) {
    const topic_pages = await this.fetch_topic_pages(db_id, topic);

    const last_page = topic_pages[topic_pages.length - 1]
    const last_page_name = this.get_page_name(last_page);
    const no_proper_end_index = last_page_name?.match(/-\s$/);

    if (no_proper_end_index) {
      throw new Error('Last page does not have a valid name format');
    }

    const new_page_name = this.calc_new_page_name(last_page_name, topic);

    return new_page_name;
  }

  create_name_prop (page_name) {
    return {
      Name: {
        title: [
          {
            text: {
              content: page_name,
            },
          },
        ],
      }
    }
  }

  async create_new_page (db_id, page_name, tags = {}) {
    const name_prop = this.create_name_prop(page_name);

    const res = await this.notion.pages.create({
      parent: {
        database_id: db_id,
      },
      icon: {
        type: 'emoji',
        emoji: '💎',
      },
      properties: {
        ...name_prop,
        ...tags,
      },
    });

    console.log(res);

    return res;
  };
}

export { CreatePage };
