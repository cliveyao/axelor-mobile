import React, {useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {Button, Screen} from '@/components/atoms';
import {useDispatch, useSelector} from 'react-redux';
import {activateColorBlind, desactivateColorBlind} from '@/features/themeSlice';
import {
  clearMessage,
  toggleFilterShowConfig,
  toggleZebraConfig,
  uploadTranslations,
} from '../features/configSlice';
import useTranslator from '@/hooks/use-translator';
import {
  getTranslations,
  selectLanguage,
} from '@/components/molecules/Translator/Translator';
import Toast from 'react-native-toast-message';
import {SwitchCard} from '@/components/molecules';

const SettingsScreen = ({route}) => {
  const {isColorBlind} = useSelector(state => state.theme);
  const {loading, zebraConfig, filterShowConfig, message} = useSelector(
    state => state.config,
  );
  const language = useSelector(selectLanguage);
  const I18n = useTranslator();
  const dispatch = useDispatch();

  useEffect(() => {
    if (message) {
      Toast.show({position: 'bottom', text1: message});
      dispatch(clearMessage());
    }
  }, [message, dispatch]);

  const handleToggleColorBlind = useCallback(
    state => {
      if (state) {
        dispatch(activateColorBlind());
      } else {
        dispatch(desactivateColorBlind());
      }
    },
    [dispatch],
  );

  const handleToggleFilter = useCallback(() => {
    dispatch(toggleFilterShowConfig());
  }, [dispatch]);

  const handleToggleZebra = useCallback(() => {
    dispatch(toggleZebraConfig());
  }, [dispatch]);

  const handleSendTranslations = useCallback(() => {
    const translations = getTranslations(language);
    dispatch(uploadTranslations({language, translations}));
  }, [dispatch, language]);

  return (
    <Screen style={styles.container}>
      <SwitchCard
        title={I18n.t('User_ShowFilter')}
        defaultValue={filterShowConfig}
        onToggle={handleToggleFilter}
      />
      <SwitchCard
        title={I18n.t('User_ZebraDevice')}
        defaultValue={zebraConfig}
        onToggle={handleToggleZebra}
      />
      <SwitchCard
        title={I18n.t('User_ColorForColorBlind')}
        defaultValue={isColorBlind}
        onToggle={state => handleToggleColorBlind(state)}
      />
      {route.params.user == null ||
      route.params.user.group.code !== 'admins' ? null : (
        <Button
          title={I18n.t('User_SendTranslations')}
          style={styles.button}
          onPress={handleSendTranslations}
          disabled={loading}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  button: {
    width: '50%',
  },
});

export default SettingsScreen;