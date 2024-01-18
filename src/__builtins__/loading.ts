import { Message } from "@arco-design/web-react";

const noop = () => {};

export const loading = async (
  title: React.ReactNode,
  processor: () => Promise<any>,
) => {
  let hide = noop;
  const loading = setTimeout(() => {
    hide = Message.loading({
      content: title ?? "Loading...",
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
