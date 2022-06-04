import { Client } from '@notionhq/client';
import { tags } from './tags.js';


export const get_notion = (token) =>  new Client({ auth: token });

// calc_page_name — START

const get_page_name = (page) => {
  const page_name_prop = page?.properties?.Name;
  const page_name = page_name_prop?.title?.[0]?.text?.content ?? '';

  return page_name;
};

const calc_new_page_name = (last_page_name = '', topic) => {
  // usually it's like: ruby 231 - 238
  const indeces = last_page_name
    .replace(`${topic}`, '')
    .trim()
    .split('-');

  const [_, end] = indeces;

  const new_start_index = +end + 1;
  const new_page_name = `${topic} ${new_start_index} - `;

  return new_page_name;
};

const fetch_db_pages = async (notion, database_id) => {
  try {
    const res = await notion.databases.query({
      database_id,
      sorts: [
        {
          timestamp: 'created_time',
          direction: 'ascending',
        },
      ],
    });

    const pages = res?.results ?? [];

    return pages;
  } catch (err) {
    console.error(`Error while fetching pages: ${err}`);
    return [];
  }
};

const prepare_new_page_name = async (notion, journal_db_id, topic) => {
  console.log('attempt');
  const pages = await fetch_db_pages(notion, journal_db_id);

  const topic_pages = pages.filter((page) => {
    const page_name = get_page_name(page);

    return page_name.includes(topic);
  });

  const last_page_name = get_page_name(topic_pages[topic_pages.length - 1]);
  const no_proper_end_index = last_page_name?.match(/-\s$/);

  if (no_proper_end_index) {
    throw new Error('Last page does not have a valid name format');
  }

  const new_page_name = calc_new_page_name(last_page_name, topic);

  return new_page_name;
};

// calc_page_name — END

// create_page — START

const create_name_prop = (page_name) => ({
  Name: {
    title: [
      {
        text: {
          content: page_name,
        },
      },
    ],
  },
});

const create_new_page = async (notion, database_id, page_name, tags = {}) => {
  const name_prop = create_name_prop(page_name);

  const res = await notion.pages.create({
    parent: {
      database_id,
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

// create_page — END

export const main = async (notion, journal_db_id, topic) => {
  try {
    const page_name = await prepare_new_page_name(notion, journal_db_id, topic);

    await create_new_page(notion, journal_db_id, page_name, tags);
  } catch (err) {
    console.error(`ERROR: while creating new page — "${err.message}"`);
  }
};
