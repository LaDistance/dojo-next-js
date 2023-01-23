import { ReactNode } from "react";
import ContentLayout from "./ContentLayout";
import Header from "./Header";

export default function BaseLayout(props: { children: ReactNode }) {
  // Variables
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
}
