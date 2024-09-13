import mixpanel from "mixpanel-browser";

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string);

const isProd = process.env.NODE_ENV === "production";

export const trackEvent = (eventName: string, eventParams?: Object) => {
  let eventData = {};
  if (eventParams) {
    eventData = {
      ...eventParams,
    };
  }

  if (!isProd) {
    console.log({ eventName, eventData });
  }

  if (mixpanel) {
    mixpanel.track(eventName, eventData);
  } else {
    console.error("Mixpanel is not initialized.");
  }
};
