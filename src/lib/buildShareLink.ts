import dynamicLinks from '@react-native-firebase/dynamic-links';

export const buildShareLink = async (screen: string, id: string) => {
  const link = await dynamicLinks().buildShortLink({
    link: `https://chatpost.com/${screen}/${id}`,
    // domainUriPrefix is created in your Firebase console
    domainUriPrefix: 'https://chatpost.page.link',
    android: {
      packageName: 'com.chatpost',

      // By default it goes to play store link if not installed
      fallbackUrl: 'https://portfolio-website-deb64.firebaseapp.com/',
    },
    // social: {}
    // optional setup which updates Firebase analytics campaign
    // "banner". This also needs setting up before hand
    analytics: {
      campaign: 'banner',
    },
  });

  return link;
};
