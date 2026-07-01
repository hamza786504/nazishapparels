import Footer from '../_components/Footer';
import Navbar from '../_components/Navbar';
import '../globals.css';

export default function PublicLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}