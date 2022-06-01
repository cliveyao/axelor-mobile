import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Screen} from '@/components/atoms';
import {SearchBar} from '@/components/molecules';
import {fetchProductVariants} from '@/modules/stock/features/productVariantSlice';
import {ProductVariantCard} from '@/modules/stock/components/molecules';

const ProductListVariables = ({route, navigation}) => {
  const {loading, productListVariables} = useSelector(
    state => state.productVariant,
  );
  const dispatch = useDispatch();
  const product = route.params.product;
  const [listPro, setListPro] = useState([]);

  useEffect(() => {
    dispatch(fetchProductVariants(product.productVariant.id));
  }, [dispatch, product.productVariant.id]);

  useEffect(() => {
    setListPro([
      {
        attribut: productListVariables[0]?.productVariantAttr1,
        value: productListVariables[0]?.productVariantValue1,
      },
      {
        attribut: productListVariables[0]?.productVariantAttr2,
        value: productListVariables[0]?.productVariantValue2,
      },
      {
        attribut: productListVariables[0]?.productVariantAttr3,
        value: productListVariables[0]?.productVariantValue3,
      },
      {
        attribut: productListVariables[0]?.productVariantAttr4,
        value: productListVariables[0]?.productVariantValue4,
      },
      {
        attribut: productListVariables[0]?.productVariantAttr5,
        value: productListVariables[0]?.productVariantValue5,
      },
    ]);
  }, [loading, productListVariables]);

  const showProductDetails = item => {
    navigation.navigate('ProductStockDetailsScreen', {product: item});
  };

  return (
    <Screen style={styles.container}>
      <SearchBar style={styles.searchBar} placeholder="Product" />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={listPro}
          renderItem={({item}) =>
            item.attribut && (
              <ProductVariantCard
                style={styles.item}
                name={product.name}
                code={product.code}
                attribut={item.attribut?.name}
                value={item.value?.name}
                key={item.id}
                onPress={showProductDetails}
              />
            )
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  searchBar: {
    marginHorizontal: 12,
    marginBottom: 8,
  },
  item: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
});

export default ProductListVariables;