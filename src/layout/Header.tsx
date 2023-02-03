import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { BiListUl } from "react-icons/bi";
import {
  RiAccountPinCircleLine,
  RiLogoutBoxRLine,
  RiMovie2Line,
} from "react-icons/ri";
import styles from "./Header.module.css";

const Header = () => {
  return (
    <nav className={styles.nav}>
      <Link href="/">
        <span className={[styles.alignedIconHelper, styles.logo].join(" ")}>
          M<RiMovie2Line />
          VIES
        </span>
      </Link>
      <AuthShowcase />
    </nav>
  );
};

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <>Signed in as {sessionData?.user?.name}</>,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Link className={styles.alignedIconHelper} href="/lists">
          <span className={styles.textWithIconRight}>My lists</span>
          <BiListUl />
        </Link>
      ),
    },
    {
      key: "3",
      label: (
        <span
          className={styles.alignedIconHelper}
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          <span className={styles.textWithIconRight}>
            {sessionData ? "Sign out" : "Sign in"}
          </span>
          <RiLogoutBoxRLine />
        </span>
      ),
    },
  ];

  return (
    <>
      <div>
        {sessionData ? (
          <Dropdown menu={{ items }}>
            <Button className={styles.alignedIconHelper}>
              <span className={styles.textWithIconRight}>Account</span>
              <RiAccountPinCircleLine />
            </Button>
          </Dropdown>
        ) : (
          <Button
            className={styles.alignedIconHelper}
            onClick={() => void signIn()}
          >
            {"Sign in"}
          </Button>
        )}
      </div>
    </>
  );
};

export default Header;
