import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <nav className={styles.nav}>
      <Link href="/">Movizz</Link>
      <AuthShowcase />
    </nav>
  );
}

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div>
        {sessionData && (
          <p className={styles.showcaseText}>
            <span>Logged in as {sessionData.user?.name}</span>
          </p>
        )}
        <button
          className={styles.loginButton}
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    </>
  );
};
