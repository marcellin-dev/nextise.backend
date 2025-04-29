/* eslint-disable prettier/prettier */
// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
//
// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     super({
//       datasources: { db: { url: process.env.DATABASE_URL } },
//       errorFormat: 'pretty',
//     });
//   }
// }

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async paginate<T>(model: string, pageable: Pageable): Promise<Page<T>> {
    const { page = 1, size = 20 } = pageable;
    const skip = (page - 1) * size;

    const query = {
      skip,
      take: size,
      where: {},
    };

    const resultPage: Page<T> = {
      content: [],
      metaData: {
        page,
        size,
        totalPages: 0,
      },
    };

    // Add the where clause to the query if it is provided
    const where = {};
    if (
      pageable.filter &&
      pageable.filter.length > 0 &&
      pageable.filter[0].includes('=')
    ) {
      pageable.filter.forEach((filterElement) => {
        const lastIndex = filterElement.indexOf('=');
        const field = filterElement.substring(0, lastIndex);
        let value: any = filterElement.substring(lastIndex + 1);

        // Try to parse value into a boolean or number
        value = processValue(value);

        // Check if the field is nested
        if (field.includes('.')) {
          const fieldParts = field.split('.');
          let currentWhere = where;
          for (let i = 0; i < fieldParts.length - 1; i++) {
            currentWhere[fieldParts[i]] = currentWhere[fieldParts[i]] || {};
            currentWhere = currentWhere[fieldParts[i]];
          }
          const lastFieldPart = fieldParts[fieldParts.length - 1];
          currentWhere[lastFieldPart] = value;
        } else {
          where[field] = value;
        }
      });
      query.where = where;
    }

    if (
      pageable.advFilter &&
      pageable.advFilter.length > 0 &&
      pageable.advFilter[0].includes('=')
    ) {
      const advWhere = {};
      pageable.advFilter.forEach((filterElement) => {
        const [field, operator, value] = filterElement.split('=');

        // Process the value
        const processedValue = processValue(value);

        // Check if the field is nested
        if (field.includes('.')) {
          const fieldParts = field.split('.');
          let currentWhere = advWhere;
          for (let i = 0; i < fieldParts.length - 1; i++) {
            currentWhere[fieldParts[i]] = currentWhere[fieldParts[i]] || {};
            currentWhere = currentWhere[fieldParts[i]];
          }
          const lastFieldPart = fieldParts[fieldParts.length - 1];
          currentWhere[lastFieldPart] = currentWhere[lastFieldPart]
            ? { ...currentWhere[lastFieldPart], [operator]: processedValue }
            : { [operator]: processedValue };
        } else {
          advWhere[field] = advWhere[field]
            ? { ...advWhere[field], [operator]: processedValue }
            : { [operator]: processedValue };
        }
      });

      // Merge the advenced filters with the existing where clause
      query.where = Object.assign(where, advWhere);
    }

    // Add the include clause to the query if it is provided
    const include = {};
    if (pageable.include && pageable.include.length > 0) {
      pageable.include.forEach((includeElement) => {
        // Check if the includeElement has a filter
        if (includeElement.includes('=')) {
          const [field, filter] = includeElement.split('=');
          // Check if the field has a nested field
          if (field.includes('>')) {
            const [parentField, nestedField] = field.split('>');
            include[parentField] = { where: { [nestedField]: filter } };
          }
        } else {
          include[includeElement] = true;
        }
      });
      query['include'] = include;
    }

    // Add the select clause to the query if it is provided
    const select = {};
    if (pageable.select && pageable.select.length > 0) {
      pageable.select.forEach((selectElement) => {
        select[selectElement] = true;
      });
      query['select'] = select;
    }

    // Add the orderBy to the query if it is provided
    let isSorted = false;
    if (
      pageable.sort &&
      pageable.sort.length > 0 &&
      pageable.sort[0].includes('=')
    ) {
      const sort = pageable.sort?.map((sortElement) => {
        const [field, order] = sortElement.split('=');
        return {
          [field]: order.toLowerCase(),
        };
      });
      query['orderBy'] = sort;
      resultPage.metaData.sort = sort;
      isSorted = true;
    } else {
      query['orderBy'] = { id: 'asc' };
    }

    console.log('query', query);

    const [data, count] = await Promise.all<[T[], number]>([
      this[model].findMany(query),
      this[model].count({ where: query['where'] }),
    ]);

    const totalPages = Math.ceil(count / size);
    const prev =
      page > 1 ? `${pageable.route}?page=${page - 1}&size=${size}` : '';
    const next =
      page < totalPages
        ? `${pageable.route}?page=${page + 1}&size=${size}`
        : '';

    resultPage.content = data;

    if (pageable.route && pageable.route != '') {
      resultPage.links = {
        first: isSorted
          ? `${pageable.route}?size=${size}&sort=[%22${pageable.sort}%22]`
          : `${pageable.route}?size=${size}`,
        prev:
          isSorted && prev != ''
            ? `${prev}&sort=[%22${pageable.sort}%22]`
            : `${prev}`,
        next:
          isSorted && next != ''
            ? `${next}&sort=[%22${pageable.sort}%22]`
            : `${next}`,
        last: isSorted
          ? `${pageable.route}?page=${totalPages}&size=${size}&sort=[%22${pageable.sort}%22]`
          : `${pageable.route}?page=${totalPages}&size=${size}`,
      };
    }

    resultPage.metaData.totalPages = totalPages;

    return resultPage;
  }
}

type MetaData = {
  page: number;
  size: number;
  totalPages: number;
  sort?: Array<{ [key: string]: 'asc' | 'desc' | string }>;
  filter?: { [key: string]: any };
};

export interface Page<T> {
  content: T[];
  metaData: MetaData;
  links?: Links;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
  filter?: string[];
  advFilter?: string[];
  include?: string[];
  select?: string[];
  route?: string;
}

type Links = {
  first: string;
  prev: string;
  next: string;
  last: string;
};

function processValue(value: any): any {
  if (value === 'true') {
    return true;
  } else if (value === 'false') {
    return false;
  } else if (!isNaN(Number(value))) {
    return Number(value);
  } else {
    return value;
  }
}
