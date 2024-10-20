import React, { createContext, useState, useContext, useEffect } from 'react';
import { Modal, View, Text, Pressable, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import { FitbitContextProps, FitbitProviderProps, responseType } from './types';
import { convertToBase64, exchangeCodeForTokens, } from './helper'
import { styles } from './styles';
const FitbitContext = createContext<FitbitContextProps | undefined>(undefined);

export const FitbitProvider = ({ children, configs }: FitbitProviderProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [webviewLoading, setWebviewLoading] = useState<boolean>(true);
  const [hideWebview, setHideWebview] = useState<boolean>(false);
  const [authCredentials, setAuthCredentials] = useState<responseType | undefined>(undefined);

  const { CLIENT_ID, CLIENT_SECRET, FITBIT_MODAL_CONTROLS } = configs;
  const themeColor = FITBIT_MODAL_CONTROLS?.themeColor || '#000';
  const bearer = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const VERIFICATION_BEARER = convertToBase64(bearer)
  const baseUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&scope=activity%20heartrate%20location%20nutrition%20oxygen_saturation%20profile%20respiratory_rate%20sleep%20social%20temperature%20weight`;

  useEffect(() => {
    setWebviewLoading(true)
    setHideWebview(false)
  }, [isVisible])

  const closeModal = () => {
    setIsVisible(false);
  };

  const handleOnUrlChanged = (data: any) => {
    const { url } = data;
    if (url.startsWith('http://localhost') && url.includes('code=')) {
      const parts = url.split('code=');
      let codeValue = parts[1];

      if (codeValue.includes('#')) {
        codeValue = codeValue.split('#')[0];
      }
      handleVerifyUser(codeValue);
     
    }
  };

  const handleVerifyUser = async (code: string) => {
    setHideWebview(true)
    setWebviewLoading(true)

    const res = await exchangeCodeForTokens(code, VERIFICATION_BEARER).then((res) => { return res });
    if (res.access_token) {
      setAuthCredentials(res)
      closeModal()
    }
  };

  return (
    <FitbitContext.Provider
      value={{
        authenticateUserFitbitAccount: () => setIsVisible(true),
        closeModal,
        usersFitBitAuthCredentials: authCredentials,
      }}>
      {children}
      <Modal transparent={true} visible={isVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {hideWebview ? <ActivityIndicator color={themeColor} size={'large'} /> :
              <WebView
                source={{ uri: baseUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleOnUrlChanged}
                javaScriptEnabled
                cacheEnabled={false}
                cacheMode="LOAD_NO_CACHE"
                onLoadEnd={() => setWebviewLoading(false)}
              />}
          </View>
          <Pressable onPress={closeModal}>
            <View style={[styles.modalFooter, { backgroundColor: themeColor }]}>
              {webviewLoading
                ?
                <ActivityIndicator color={'white'} size={'large'} />
                : <Text style={{
                  color: 'white',
                  fontWeight: 'bold'
                }}>CLOSE</Text>}
            </View>
          </Pressable>
        </View>
      </Modal>
    </FitbitContext.Provider>
  );
};

export const useFitbit = () => {
  const context = useContext(FitbitContext);
  if (!context) {
    throw new Error('useFitbit must be used within a FitbitProvider');
  }
  return context;
};



