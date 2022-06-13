import { Client } from '@notionhq/client';

export const get_notion = (token) =>  new Client({ auth: token });
