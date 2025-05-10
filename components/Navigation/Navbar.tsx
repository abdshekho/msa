import Link from 'next/link';
import styles from './Navbar.module.css'; // We'll create this CSS module next

const Navbar = () => {
    return (
        <nav className={ styles.navbar }>
            <Link href="/" legacyBehavior>
                <a className={ styles.navLink }>Home</a>
            </Link>
            <Link href="/about" legacyBehavior>
                <a className={ styles.navLink }>About</a>
            </Link>
            <Link href="/contact" legacyBehavior>
                <a className={ styles.navLink }>Contact</a>
            </Link>
            {/* Add other nav links here */ }
        </nav>
    );
};

export default Navbar;
