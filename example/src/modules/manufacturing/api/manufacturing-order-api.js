import {axiosApiProvider} from '@aos-mobile/core';
import ManufacturingOrder from '../types/manufacturing-order';

const manufacturingOrderFields = [
  'id',
  'manufOrderSeq',
  'statusSelect',
  'prioritySelect',
  'product',
  'qty',
  'unit',
  'clientPartner',
  'saleOrderSet',
  'toConsumeProdProductList',
  'note',
  'moCommentFromSaleOrder',
  'moCommentFromSaleOrderLine',
  'parentMO',
  'wasteProdProductList',
  'productionOrderSet',
  'company',
];

const sortByFields = [
  'statusSelect',
  '-realStartDateT',
  'plannedStartDateT',
  'manufOrderSeq',
];

const createManufOrderCriteria = (companyId, workshopId, searchValue) => {
  let criterias = [];
  criterias.push(
    {
      fieldName: 'typeSelect',
      operator: '=',
      value: ManufacturingOrder.type.production,
    },
    {
      operator: 'OR',
      criteria: [
        {
          fieldName: 'statusSelect',
          operator: '=',
          value: ManufacturingOrder.status.Planned,
        },
        {
          fieldName: 'statusSelect',
          operator: '=',
          value: ManufacturingOrder.status.InProgress,
        },
        {
          fieldName: 'statusSelect',
          operator: '=',
          value: ManufacturingOrder.status.StandBy,
        },
        {
          fieldName: 'statusSelect',
          operator: '=',
          value: ManufacturingOrder.status.Finished,
        },
      ],
    },
  );
  if (companyId != null) {
    criterias.push({
      fieldName: 'company.id',
      operator: '=',
      value: companyId,
    });
  }
  if (searchValue != null) {
    criterias.push({
      fieldName: 'manufOrderSeq',
      operator: 'like',
      value: searchValue,
    });
  }
  if (workshopId != null) {
    criterias.push({
      operator: 'or',
      criteria: [
        {
          fieldName: 'workshopStockLocation.id',
          operator: '=',
          value: workshopId,
        },
        {
          fieldName: 'workshopStockLocation.parentStockLocation.id',
          operator: '=',
          value: workshopId,
        },
      ],
    });
  }
  return criterias;
};

export async function searchManufacturingOrderFilter({
  companyId = null,
  workshopId = null,
  searchValue = null,
  page = 0,
}) {
  return axiosApiProvider.post({
    url: '/ws/rest/com.axelor.apps.production.db.ManufOrder/search',
    data: {
      data: {
        criteria: [
          {
            operator: 'and',
            criteria: createManufOrderCriteria(
              companyId,
              workshopId,
              searchValue,
            ),
          },
        ],
      },
      fields: manufacturingOrderFields,
      sortBy: sortByFields,
      limit: 10,
      offset: 10 * page,
    },
  });
}

export async function fetchManufacturingOrder({manufOrderId}) {
  return axiosApiProvider.post({
    url: `/ws/rest/com.axelor.apps.production.db.ManufOrder/${manufOrderId}/fetch`,
    data: {
      fields: manufacturingOrderFields,
      related: {product: ['name', 'code', 'picture']},
    },
  });
}

export async function fetchManufacturingOrderOfProductionOrder({
  productionOrderList,
  page = 0,
}) {
  if (productionOrderList == null) {
    return null;
  }

  return axiosApiProvider
    .post({
      url: '/ws/rest/com.axelor.apps.production.db.ProductionOrder/search',
      data: {
        data: {
          _domain: 'self.id IN :productionOrderIds',
          _domainContext: {
            productionOrderIds: productionOrderList.map(
              productionOrder => productionOrder.id,
            ),
          },
        },
        fields: ['id', 'manufOrderSet'],
      },
    })
    .then(res => {
      const result = res?.data?.data;

      const manufOrderList = result
        ?.map(productionOrder => productionOrder?.manufOrderSet)
        ?.flat(1);

      if (manufOrderList == null) {
        return null;
      }

      const manufOrderIds = [];
      manufOrderList.forEach(manufOrder => {
        manufOrderIds.push(manufOrder.id);
      });

      return manufOrderIds;
    })
    .then(manufOrderIds => fetchManufacturingOrderByIds({manufOrderIds, page}));
}

async function fetchManufacturingOrderByIds({manufOrderIds, page = 0}) {
  if (manufOrderIds == null) {
    return null;
  }

  return axiosApiProvider.post({
    url: '/ws/rest/com.axelor.apps.production.db.ManufOrder/search',
    data: {
      data: {
        _domain: 'self.id IN :manufOrderIds',
        _domainContext: {
          manufOrderIds: manufOrderIds,
        },
      },
      fields: ['id', 'manufOrderSeq', 'statusSelect'],
      sortBy: sortByFields,
      limit: 10,
      offset: 10 * page,
    },
  });
}

export async function fetchChildrenManufacturingOrders({
  parentManufOrderId,
  page = 0,
}) {
  return axiosApiProvider.post({
    url: '/ws/rest/com.axelor.apps.production.db.ManufOrder/search',
    data: {
      data: {
        criteria: [
          {
            operator: 'and',
            criteria: [
              {
                fieldName: 'parentMO.id',
                operator: '=',
                value: parentManufOrderId,
              },
            ],
          },
        ],
      },
      fields: manufacturingOrderFields,
      sortBy: sortByFields,
      limit: 10,
      offset: 10 * page,
    },
  });
}
