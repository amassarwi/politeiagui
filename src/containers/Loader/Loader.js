import React, { createContext, useContext, useEffect, useState } from "react";
import { useLoader } from "./hooks";
import LoaderScreen from "./LoaderScreen";
import useLocalStorage from "src/hooks/utils/useLocalStorage";
import { useConfig } from "src/containers/Config";

export const LoaderContext = createContext();
export const useLoaderContext = () => useContext(LoaderContext);

const Loader = ({ children }) => {
  const { enablePaywall, enableCredits } = useConfig();
  const [initDone, setInitDone] = useState(false);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState(null);
  const {
    onRequestApiInfo,
    onRequestCurrentUser,
    user,
    localLogout,
    onPollUserPayment,
    onUserProposalCredits,
    onGetPolicy,
    onWsConnect,
    toggleQuiesceMode
  } = useLoader();
  const [
    userActiveOnLocalStorage,
    setUserActiveOnLocalStorage
  ] = useLocalStorage("userActive", false);

  // fetch api info and current user if any
  useEffect(() => {
    async function onInit() {
      try {
        const apiInfo = await onRequestApiInfo(false);
        setApiInfo(apiInfo);
        await onGetPolicy();
        if (apiInfo.activeusersession) {
          await onRequestCurrentUser();
        }
        if (apiInfo.quiesce) {
          await toggleQuiesceMode(apiInfo.quiesce);
        }
        setInitDone(true);
      } catch (e) {
        setError(e);
      }
    }
    onInit();
  }, [onRequestApiInfo, onRequestCurrentUser, onGetPolicy, toggleQuiesceMode]);

  const hasUser = !!user;

  // mark user as active on login
  useEffect(() => {
    if (initDone) {
      setUserActiveOnLocalStorage(hasUser);
    }
  }, [hasUser, initDone, setUserActiveOnLocalStorage]);

  // connect to websocket when auth user found
  useEffect(() => {
    if (initDone && hasUser) {
      // XXX dynamic domain
      onWsConnect("wss://127.0.0.1:4443/v1/aws");
    }
  }, [initDone, hasUser, onWsConnect]);

  // trigger logout if user isn't marked as active on local storage
  // this is usefull for reflecting logout across different tabs
  useEffect(() => {
    if (!userActiveOnLocalStorage) {
      localLogout(false);
    }
  }, [userActiveOnLocalStorage, localLogout]);

  // poll user paywall if applicable
  useEffect(() => {
    const userPaywallNotPaid = !!user && !!user.paywalladdress;
    if (enablePaywall && userPaywallNotPaid) {
      onPollUserPayment();
    }
  }, [user, enablePaywall, onPollUserPayment]);

  // fetch user credits if applicable
  useEffect(() => {
    if (enableCredits && hasUser) {
      onUserProposalCredits();
    }
  }, [hasUser, onUserProposalCredits, enableCredits]);

  return (
    <LoaderContext.Provider
      value={{
        initDone,
        error,
        currentUser: user,
        apiInfo
      }}>
      {initDone && !error ? children : <LoaderScreen error={error} />}
    </LoaderContext.Provider>
  );
};

export default Loader;
