import { Observer } from "@formily/react";
import { observable } from "@formily/reactive";
import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import { render as reactRender, unmount as reactUnmount } from "./render";
export interface IPortalProps {
  id?: string | symbol;
}

const PortalMap = observable(new Map<string | symbol, React.ReactNode>());

export const createPortalProvider = (id: string | symbol) => {
  const Portal = (props: React.PropsWithChildren<IPortalProps>) => {
    const portalId = props.id ?? id;
    if (portalId && !PortalMap.has(portalId)) {
      PortalMap.set(portalId, null);
    }

    return (
      <Fragment>
        {props.children}
        <Observer>
          {() => {
            if (!portalId) return null;
            const portal = PortalMap.get(portalId);
            if (portal) return createPortal(portal, document.body);
            return null as any;
          }}
        </Observer>
      </Fragment>
    );
  };

  return Portal;
};

export function createPortalRoot<T extends React.ReactNode>(
  host: HTMLElement,
  id: string
) {
  function render(renderer?: () => T) {
    if (PortalMap.has(id)) {
      PortalMap.set(id, renderer?.());
    } else if (host) {
      // biome-ignore lint/complexity/noUselessFragments: <explanation>
      reactRender(<Fragment>{renderer?.()}</Fragment>, host);
    }
  }

  function unmount() {
    if (PortalMap.has(id)) {
      PortalMap.set(id, null);
    }
    if (host) {
      const unmountResult = reactUnmount(host);
      if (unmountResult && host.parentNode) {
        host.parentNode?.removeChild(host);
      }
    }
  }

  return {
    render,
    unmount,
  };
}
