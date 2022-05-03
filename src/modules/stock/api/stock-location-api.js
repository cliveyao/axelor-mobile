import axios from 'axios';

const TYPE_INTERNAL = 1;
const TYPE_EXTERNAL = 2;
const TYPE_VIRTUAL = 3;

export async function searchStockLocation() {
  return axios.post('/ws/rest/com.axelor.apps.stock.db.StockLocation/search', {
    data: {
      criteria: [
        {
          operator: 'and',
          criteria: [
            {
              fieldName: 'typeSelect',
              operator: '=',
              value: TYPE_INTERNAL,
            },
            {
              fieldName: 'isWorkshop',
              operator: '=',
              value: false,
            },
            {
              fieldName: 'company.id',
              operator: '=',
              value: 1,
            },
          ],
        },
      ],
    },
    fields: ['name', 'id'],
    sortBy: ['id', 'name'],
    limit: 20,
    offset: 0,
  });
}
