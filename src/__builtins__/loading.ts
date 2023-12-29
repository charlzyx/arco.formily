import { Message } from "@arco-design/web-react";

const noop = () => {};

export const loading = async (
  title: React.ReactNode = "Loading...",
  processor: () => Promise<any>
) => {
  let hide = noop;
  let loading = setTimeout(() => {
    hide = Message.loading({
      content: title,
    });
  }, 100);
  try {
    return await processor();
  } finally {
    if (hide !== noop) {
      hide();
    }
    clearTimeout(loading);
  }
};
