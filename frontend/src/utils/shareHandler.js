export const setupShareIntentListener = (onReceiveSharedContent) => {
  // Simulator stub for live presentation
  // In native release builds, this hooks into react-native-receive-sharing-intent
  return {
    simulateIncomingShare: (rawMessage) => {
      if (onReceiveSharedContent && typeof onReceiveSharedContent === 'function') {
        onReceiveSharedContent(rawMessage);
      }
    },
    remove: () => {},
  };
};