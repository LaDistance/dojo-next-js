import { ConfigProvider, theme } from "antd";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
const { darkAlgorithm } = theme;

import BaseLayout from "../layout/BaseLayout";

import { api } from "../utils/api";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ConfigProvider
        theme={{
          algorithm: darkAlgorithm,
        }}
      >
        <BaseLayout>
          <Component {...pageProps} />
        </BaseLayout>
      </ConfigProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
