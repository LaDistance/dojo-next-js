import type { ReactNode } from "react";
import ContentLayout from "./ContentLayout";
import Header from "./Header";

const BaseLayout = (props: { children: ReactNode }) => {
  const { children } = props;

  return (
    <main>
      <Header />
      <div>
        <div>
          <ContentLayout>{children}</ContentLayout>
        </div>
      </div>
    </main>
  );
};

export default BaseLayout;
