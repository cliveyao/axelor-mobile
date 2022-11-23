import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {handlerApiCall} from '@aos-mobile/core';
import {getProductStockIndicators} from '../api/product-api';

export const fetchProductIndicators = createAsyncThunk(
  'product/fetchProductIndicators',
  async function (data, {getState}) {
    return handlerApiCall({
      fetchFunction: getProductStockIndicators,
      data,
      action: 'fetch product stock indicators',
      getState,
      responseOptions: {isArrayResponse: false},
    });
  },
);

var getProductAvailabilty = async (data, {getState}) => {
  return handlerApiCall({
    fetchFunction: getProductStockIndicators,
    data,
    action: 'fetch product stock indicators',
    getState,
    responseOptions: {isArrayResponse: false},
  });
};

async function fetchData(data, {getState}) {
  return await getProductAvailabilty(data, {getState});
}

export const fetchProductsAvailability = createAsyncThunk(
  'product/fetchProductsAvailability',
  async function (data, {getState}) {
    let promises = [];
    data.productList.forEach(product => {
      promises.push(
        fetchData(
          {
            productId: product.id,
            companyId: data.companyId,
            stockLocationId: data.stockLocationId,
            version: product.version,
          },
          {getState},
        ),
      );
    });
    return Promise.all(promises);
  },
);

export const fetchProductDistribution = createAsyncThunk(
  'product/fetchProductDistribution',
  async function (data, {getState}) {
    let promises = [];
    data.stockLocationList.forEach(line => {
      promises.push(
        fetchData(
          {
            productId: data.product.id,
            companyId: data.companyId,
            stockLocationId: line.stockLocation.id,
            version: data.product.version,
          },
          {getState},
        ),
      );
    });
    return Promise.all(promises);
  },
);

const initialState = {
  loading: false,
  loadingProductIndicators: false,
  productIndicators: {},
  listAvailabilty: [],
  listAvailabiltyDistribution: [],
};

const productIndicators = createSlice({
  name: 'productIndicators',
  initialState,
  extraReducers: builder => {
    builder.addCase(fetchProductIndicators.pending, state => {
      state.loadingProductIndicators = true;
    });
    builder.addCase(fetchProductIndicators.fulfilled, (state, action) => {
      state.loadingProductIndicators = false;
      state.productIndicators = action.payload;
    });
    builder.addCase(fetchProductsAvailability.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchProductsAvailability.fulfilled, (state, action) => {
      state.loading = false;
      state.listAvailabilty = action.payload;
    });
    builder.addCase(fetchProductDistribution.pending, state => {
      state.loading = true;
    });
    builder.addCase(fetchProductDistribution.fulfilled, (state, action) => {
      state.loading = false;
      state.listAvailabiltyDistribution = action.payload;
    });
  },
});

export const productIndicatorsReducer = productIndicators.reducer;