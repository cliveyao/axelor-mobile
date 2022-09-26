import React from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';

const ChipSelect = ({children, scrollable = false}) => {
  return (
    <View style={[styles.chipContainer, scrollable ? styles.marginLeft : null]}>
      {scrollable ? (
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  marginLeft: {
    marginHorizontal: 16,
  },
});

export default ChipSelect;