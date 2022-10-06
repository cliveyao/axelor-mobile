import React from 'react';
import {StyleSheet} from 'react-native';
import {
  Card,
  LabelText,
  Screen,
  ScrollList,
  HeaderContainer,
  Text,
} from '@aos-mobile/ui';
import {useTranslator} from '@aos-mobile/core';
import {ManufacturingOrderHeader} from '../../components/organisms';
import {splitSaleOrderRef} from '../../utils/formaters';

const IS_INFINITE_SCROLL_ENABLED = false;

const ManufacturingOrderListSaleOrderScreen = ({route}) => {
  const manufOrder = route.params.manufOrder;
  const I18n = useTranslator();

  return (
    <Screen listScreen={true}>
      <HeaderContainer
        expandableFilter={false}
        fixedItems={
          <>
            <ManufacturingOrderHeader
              parentMO={manufOrder.parentMO}
              reference={manufOrder.manufOrderSeq}
              status={manufOrder.statusSelect}
              priority={manufOrder.prioritySelect}
            />
            <Text style={styles.orderTitle}>
              {I18n.t('Manufacturing_RefClient')}
            </Text>
          </>
        }
      />
      <ScrollList
        loadingList={IS_INFINITE_SCROLL_ENABLED}
        data={manufOrder.saleOrderSet}
        renderItem={({item}) => {
          const saleOrderRef = splitSaleOrderRef(item.fullName);
          return (
            <Card style={styles.itemContainer}>
              <LabelText
                style={styles.itemTitle}
                title={saleOrderRef.ref}
                iconName="tag"
              />
              <LabelText title={saleOrderRef.client} iconName="user" />
            </Card>
          );
        }}
        isListEnd={!IS_INFINITE_SCROLL_ENABLED}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  orderTitle: {
    marginLeft: 12,
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  itemContainer: {
    marginHorizontal: 12,
    marginVertical: 4,
  },
  itemTitle: {
    fontWeight: 'bold',
  },
});

export default ManufacturingOrderListSaleOrderScreen;